import { readFileSync } from 'fs';
import { join } from 'path';
import { generateJsonSchema, validateJson, validator } from './validator';

const editorTestPath= join(__dirname, 
  '..',
  '..',
  '..',
  'test-data',
  'editor-test.ts'
  )

const testSchema =  JSON.parse(readFileSync(join(__dirname,'..','..','..','test-data','test_schema.json'), 'utf8'));
const authorSchema = generateJsonSchema(editorTestPath, 'AuthorTest');
const sectionSchema = generateJsonSchema(editorTestPath, 'SectionTest');
const storySchema = generateJsonSchema(editorTestPath, 'StoryTest');


const typesPath = join(__dirname,
  '..',
  '..',
  '..',
  'node_modules',
  '@quintype/migration-helpers',
  'build',
  'main',
  'lib',
  'editor-types.d.ts');

function authorJSONSchemaSample(additionalProperties: any): object {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name'],
    additionalProperties,
    description: 'Author Definition',
    definitions: {}
  };
}

describe('generateJsonSchema', () => {
  it('just returns the schema of author test', () => {
    expect(authorSchema).toEqual(testSchema.definitions.AuthorTest);
  });

  it('just returns the schema of section-test', () => {
    expect(sectionSchema).toEqual(testSchema.definitions.SectionTest);
  });
  
  it('just returns the schema of story-test', () => {
    expect(storySchema).toEqual(testSchema.definitions.StoryTest);
  });
});

describe('validateJsonTest', () => {
  it('should validate json', () => {
    const Author1 = {
      name: 'Author1 name'
    };
    const Author2 = {
      name: 'Author2 name'
    };
    const Section1 = {
      name: 'Section1 name'
    };
    const Section2 = {
      name: 'Section2 name'
    };
    const Story = {
      name: 'Story name',
      sections: [Section1, Section2],
      authors: [Author1, Author2]
    };
    expect(validateJson(Author1, authorSchema)).toBeNull();
    expect(validateJson(Section1, sectionSchema)).toBeNull();
    expect(validateJson(Story, storySchema)).toBeNull();
  });

  it('should return error for additional properties in json', () => {
    const Author = {
      name: 'Author name',
      id: 12
    };
    const Section = {
      name: 'Section1 name',
      id: 12
    };
    const Story = {
      name: 'Story name',
      sections: [Section],
      authors: [Author]
    };

    expect(validateJson(Author, authorSchema)).toEqual(
      expect.arrayContaining([expect.objectContaining({ params: { additionalProperty: 'id' } })])
    );
    expect(validateJson(Section, sectionSchema)).toEqual(
      expect.arrayContaining([expect.objectContaining({ params: { additionalProperty: 'id' } })])
    );
    expect(validateJson(Story, storySchema)).toEqual(
      expect.arrayContaining([expect.objectContaining({ params: { additionalProperty: 'id' } })])
    );
  });

  it('should not return error for additional properties if additional properties is set to true in schema', () => {
    const Author = {
      name: 'Author name',
      id: 12
    };
    const output = validateJson(Author, authorJSONSchemaSample(true));
    expect(output).toBeNull();
  });

  it('should return error if additional properties does not match type', () => {
    const Author = {
      name: 'Author name',
      id: 12
    };
    const output = validateJson(Author, authorJSONSchemaSample({ type: 'string' }));
    expect(output).toEqual([
      {
        dataPath: '/id',
        keyword: 'type',
        message: 'should be string',
        params: { type: 'string' },
        schemaPath: '#/additionalProperties/type',
        parentSchema: { type: 'string' },
        schema: 'string',
        data: 12
      }
    ]);
  });

  it('should valid additional properties if it matches type', () => {
    const Author = {
      name: 'Author name',
      id: '12'
    };
    const output = validateJson(Author, authorJSONSchemaSample({ type: 'string' }));
    expect(output).toBeNull();
  });
});

describe('validatorTest',() => {
  it('should validate Author and return [additional property with log level warning, required property with log level error]',()=>{
    const Author = {
      name: 'Author name',
      'external-id': 'user-id',
      'email': 'author.name@please.chan',
      'displayName': 'Author name',
      'bio': 'Test',
      'designation': 'Author'
    }
    const messageObject = validator('Author',typesPath, Author);
    expect(messageObject).toEqual(
      expect.arrayContaining(
        [
          expect.objectContaining({"message": "Author with id user-id has additional properties displayName ","logLevel":"warn"}),
          expect.objectContaining({"message":"Author with id user-id  should have required property \'username\'","logLevel": "error" })
        ])
    );
  });

  it('should validate Author and return error wrong type and log level error',() => {
    const Author = {
      name: 'Author name',
      'external-id': 22,
      'email': 'author.name@please.chan',
      'bio': 'Test',
    }
    const messageObject = validator('Author',typesPath, Author);
    expect(messageObject).toEqual(
      expect.arrayContaining([expect.objectContaining({"message": "Author with id 22 has wrong type for /external-id. It should be string","logLevel":"error"})])
    );
  });

  it('should validate Section and return error missing property with log level error',() => {
    const Section= {'external-id': 'section-id'};
    const messageObject = validator('Section',typesPath,Section);
    expect(messageObject).toEqual(
      expect.arrayContaining([expect.objectContaining({"message": "Section with id section-id  should have required property 'name'","logLevel":"error"})])
    );
  })

  it('should validate seo-metadata and return error with log level error', () => {
   const Section = {
    'external-id': 'section-id',
    'name': "Section Name",
    'seo-metadata': {
      description : 33
    }
   };
   const messageObject = validator('Section', typesPath,Section);
   expect(messageObject).toEqual(
    expect.arrayContaining([
      expect.objectContaining({"message": "Section with id section-id has wrong type for /seo-metadata/description. It should be string","logLevel":"error"}),
      expect.objectContaining({"logLevel": "error", "message": "Section with id section-id  should have required property 'keywords' in /seo-metadata"}),
      expect.objectContaining({"logLevel": "error", "message": "Section with id section-id  should have required property 'page-title' in /seo-metadata"}),
      expect.objectContaining({"logLevel": "error", "message": "Section with id section-id  should have required property 'title' in /seo-metadata"})
    ])
  );
  });

  it('should validate story and return error with log level error', () => {
  const Story = {
    'external-id' :'sec-id',
    'headline' : 'Story-headline',
    'slug' :'Story-slug',
    'first-published-at' : 11234,
    'last-published-at' : 5678,
    'published-at': "11",
    'temporary-hero-image-url': 123,
    'story-template': 'Story-template',
    'authors': [{
      'external-id': 'user-id','name': "name",'email': "email", "username" :"username"}],
    'tags' :[{'name':'name'}],
    'sections': [{'external-id': 'section-id','name': "name"}],
    'summary': 'Summary',
    'story-elements': [{'title':"",'description':"", 'type': "ff", 'subtype': "subtype"}],
    'body': 'Story-body',
    'subheadline' : 'sub',
  };
  const messageObject = validator('Story',typesPath,Story);
  expect(messageObject).toEqual(
    expect.arrayContaining([expect.objectContaining({"message": "Story with id sec-id has wrong type for /temporary-hero-image-url. It should be string","logLevel":"error"})
  ]));
  })

  it('should validate story and return valid', () => {
    const Story = {
      'external-id' :'sec-id',
      'headline' : 'Story-headline',
      'slug' :'Story-slug',
      'first-published-at' : 11234,
      'last-published-at' : 5678,
      'published-at': 11,
      'temporary-hero-image-url': "url",
      'story-template': 'Story-template',
      'authors': [{
        'external-id': 'user-id','name': "name",'email': "email", "username" :"username"}],
      'tags' :[{'name':'name'}],
      'sections': [{'external-id': 'section-id','name': "name"}],
      'summary': 'Summary',
      'story-elements': [{'title':"",'description':"", 'type': "text", 'subtype': "subtype"}],
      'subheadline' : 'sub'
    };
    const messageObject = validator('Story',typesPath,Story);
    expect(messageObject).toEqual('valid');
    })

    it('should validate story and return valid', () => {
      const Story = {
        'external-id' :'sec-id',
        'headline' : 'Story-headline',
        'slug' :'Story-slug',
        'first-published-at' : 11234,
        'last-published-at' : 5678,
        'published-at': 11,
        'temporary-hero-image-url': "url",
        'story-template': 'Story-template',
        'authors': [{
          'external-id': 'user-id','name': "name",'email': "email", "username" :"username"}],
        'tags' :[{'name':'name'}],
        'sections': [{'external-id': 'section-id','name': "name"}],
        'summary': 'Summary',
        'body': 'Body',
        'subheadline' : 'sub'
      };
      const messageObject = validator('Story',typesPath,Story);
      expect(messageObject).toEqual('valid');
      })
})
