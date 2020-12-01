import { readFileSync } from 'fs';
import path, { join } from 'path';
import { generateJsonSchema, validator, validateJson } from '../utils/validator';

export const typesPath = join(
  path.dirname(require.resolve('@quintype/migration-helpers')),
  'lib',
  'editor-types.d.ts'
);

const testSchema = JSON.parse(readFileSync(path.resolve(__dirname,'..', '..', '..', 'test-data', 'test_schema.json'), 'utf8'));
const storySchema = generateJsonSchema(path.resolve(__dirname, '..', '..', '..', 'test-data', 'editor-test.ts'), 'StoryTest');
const authorSchema = generateJsonSchema(path.resolve(__dirname, '..', '..', '..', 'test-data', 'editor-test.ts'), 'AuthorTest');

describe('generateJsonSchema', () => {
  it('just returns the schema of author test', () => {
    expect(authorSchema).toEqual(testSchema.definitions.AuthorTest);
  });

  it('just returns the schema of story test', () => {
    expect(storySchema).toEqual(testSchema.definitions.StoryTest);
  });
});

describe('validateJsonTest', () => {
  it('should validate json', () => {
    const Author1 = {
      name: ''
    };
    const Author2 = {
      name: 'Author2 name'
    };
    const Author3 = {
      name: 'Foobar',
      username: 'Foobar',
      email: 'foo@abc.com'
    };
    const type = 'Author';
    expect(validateJson(Author1, authorSchema, new Set(), type)).toEqual(
      expect.arrayContaining([expect.objectContaining({"message": "should NOT be shorter than 1 characters"})]));
    expect(validateJson(Author2, authorSchema, new Set(), type)).toEqual(
      expect.arrayContaining([expect.objectContaining({"message": "should NOT be longer than 10 characters"})]));
    expect(validateJson(Author3, authorSchema, new Set(), type)).toEqual([]);
  });

  it('should validate json', () => {
    const Story1 = {
      name: 'story 1'
    };
    const Story2 = {
      name: 'Story name',
      sections: [],
      authors: []
    };
    const Story3 = {
      name: 'Foobar',
      sections: [{ name: 'sec1'}],
      authors: [{ name: 'foobar', username: 'foobar', email: 'foo@abc.com'}]
    };
    const type = 'Story';
    expect(validateJson(Story1, storySchema, new Set(), type)).toEqual(
      expect.arrayContaining(
        [expect.objectContaining({"message": "should have required property 'sections'"}),
         expect.objectContaining({"message": "should have required property 'authors'"})]));
    expect(validateJson(Story2, storySchema, new Set(), type)).toEqual(
      expect.arrayContaining([expect.objectContaining({"message": "should NOT have fewer than 1 items"})]));
    expect(validateJson(Story3, storySchema, new Set(), type)).toEqual([]);
  });

  it('should throw "uniqueKey" error if story has duplicate slug', () => {
    const uniqueSlugs = new Set<string>()
    const Story1 = {
      name: 'Foobar',
      slug: 'foobar',
      sections: [{ name: 'sec1'}],
      authors: [{ name: 'foobar', username: 'foobar', email: 'foobar@abc.com' }]
    };
    const Story2 = {
      name: 'Foobar',
      slug: 'foobar',
      sections: [{ name: 'sec1'}],
      authors: [{ name: 'foobar', username: 'foobar', email: 'foobar@abc.com' }]
    };
    const type = 'Story';
    expect(validateJson(Story1, storySchema, uniqueSlugs, type)).toEqual([]);
    expect(validateJson(Story2, storySchema, uniqueSlugs, type)).toEqual(
      expect.arrayContaining([expect.objectContaining({"keyword": "uniqueKey", "params": {"value": "foobar"}})])
    );
  });
});

/* Tag validation tests */
describe('tagValidationTest', () => {
  it('should throw "minLength" error if name has less that 2 characters', () => {
    const Tag1 = {
      name: 'a'
    };
    const output = validator('Tag', Tag1, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {minLength: [expect.objectContaining({ key: 'name:2', ids: [undefined] })]})
    );
  });

  it('should throw "maxLength" error if name has more that 100 characters', () => {
    const Tag1 = {
      name: 'snsvjhdsjkhdchbcjdhcjsbdjvkjsdjvhskjdhklsjhkjhdkjbcjbdcbsjdcksjcdjkscnksjdnjncksjdnckjnslkcjndjsndbvjdcjbdjfvdnk'
    };
    const output = validator('Tag', Tag1, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {maxLength: [expect.objectContaining({ key: 'name:100', ids: [undefined] })]})
    );
  });

  it('should throw "minLength" error if name has less that 3 characters', () => {
    const Tag1 = {
      name: 'testTag'
    };
    const output = validator('Tag', Tag1, {}, new Set());
    expect(output).toEqual(expect.objectContaining({ successful: 1}))
  });
});


/* Author validation tests */
describe('authorValidationTest', () => {
  it('should throw "requiredProperty" error if username, external-id is not provided', () => {
    const Author = {
      name: 'Foo Bar',
      email: 'author@abc.com'
    };
    const output = validator('Author', Author, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {required: [expect.objectContaining({ key: 'external-id:Author', ids: [undefined] }), 
                    expect.objectContaining({ key: 'username:Author', ids: [undefined] })]})
    );
  });

  it('should throw "requiredProperty" error if name, email is not provided', () => {
    const Author = {
      username: 'Foo',
      'external-id': 'author-001'
    };
    const output = validator('Author', Author, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {required: [expect.objectContaining({ key: 'name:Author', ids: ['author-001'] }), 
                    expect.objectContaining({ key: 'email:Author', ids: ['author-001'] })]})
    );
  });

  it('should throw "type" error if any of the keys has wrong type', () => {
    const Author = {
      name: 'Foo',
      username: 'Foo',
      email: 'author@abc.com',
      'external-id': 123,
      role: 14
    };
    const output = validator('Author', Author, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {type: [expect.objectContaining({ key: 'external-id:string', ids: [123] }), 
                expect.objectContaining({ key: 'role:string', ids: [123] })]})
    );
  });

  it('should throw "additionalProperties" error if any extra key is provided which is not defined in schema', () => {
    const Author = {
      name: 'Foo',
      username: 'Foo',
      email: 'author@abc.com',
      'external-id': 'author-001',
      role: 'Editor',
      metadata: {
        'address': 'Bangalore'
      },
      foo: 'bar'
    };
    const output = validator('Author', Author, {}, new Set());
    expect(output).toEqual( expect.objectContaining(
      {additionalProperties: [expect.objectContaining({ key: 'foo:Author', ids: ['author-001'] })]})
    );
  });

  it('should validate successfully when all required keys with correct datatypes are provided', () => {
    const Author = {
      name: 'Foo',
      username: 'Foo',
      email: 'author@abc.com',
      'external-id': 'author-001',
      role: 'Editor'
    };
    const output = validator('Author', Author, {}, new Set());
    expect(output).toEqual({ 'dataType': 'Author', 'total': 1, 'failed': 0, 'successful': 1, 'valid': ['author-001']});
  });
})

/* Section validation tests */
describe('sectionValidationTest', () => {
  it('should throw "requiredProperty" error if slug, external-id is not provided', () => {
    const Section = {
      name: 'Sports',
      'display-name': 'sports'
    };
    const output = validator('Section', Section, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {required: [expect.objectContaining({ key: 'external-id:Section', ids: [undefined] }), 
                    expect.objectContaining({ key: 'slug:Section', ids: [undefined] })]})
    );
  });

  it('should throw "required" error if name is not provided', () => {
    const Section = {
      slug: 'sports',
      'external-id': 'section-001'
    };
    const output = validator('Section', Section, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {required: [expect.objectContaining({ key: 'name:Section', ids: ['section-001'] })]})
    );
  });

  it('should throw "type" along with expected type error if any of the keys has wrong type', () => {
    const Section = {
      name: 'Sports',
      'display-name': 'sports',
      slug: 123,
      'external-id': 'section-001'
    };
    const output = validator('Section', Section, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {type: [expect.objectContaining({ key: 'slug:string', ids: ['section-001'] })]})
    );
  });

  it('should throw "additionalProperties" error if any extra key is provided which is not defined in schema', () => {
    const Section = {
      name: 'Sports',
      'display-name': 'sports',
      slug: 'sports',
      'external-id': 'section-001',
      'seo-metadata': {
        description: 'a section'
      },
      foo: 'bar'
    };
    const output = validator('Section', Section, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {additionalProperties: [expect.objectContaining({ key: 'foo:Section', ids: ['section-001'] })]})
    );
  });

  it('should throw "pattern" error if slug is not valid', () => {
    const Section = {
      name: 'Sports',
      slug: 'sports&w',
      'external-id': 'section-001'
    };
    const output = validator('Section', Section, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {pattern: [expect.objectContaining({ key: 'slug:Invalid-string', ids: ['section-001'] })]})
    );
  });

  it('should validate successfully when all required keys with correct datatypes are provided', () => {
    const Section = {
      name: 'Sports',
      'display-name': 'sports',
      slug: 'sports',
      'external-id': 'section-001'
    };
    const output = validator('Section', Section, {}, new Set());
    expect(output).toEqual({ 'dataType': 'Section', 'total': 1, 'failed': 0, 'successful': 1, 'valid': ['section-001']});
  });
})

/* Story validation tests */
describe('storyValidationTest', () => {
  it('should throw "requiredProperty" error if body/story-elements/cards or publish dates are not provided', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'story-template': 'text',
      status: 'published',
      authors: [{ name:'Foo', email: 'author@abc.com', 'external-id': 'author-001'}],
      sections: [{ name:'Foo', slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {required: [expect.objectContaining({ key: 'any one of body, story-elements or cards:Story', ids: ['story-001'] }),
                    expect.objectContaining({ key: 'first-published-at:Story', ids: ['story-001'] }),
                    expect.objectContaining({ key: 'last-published-at:Story', ids: ['story-001'] }),
                    expect.objectContaining({ key: 'published-at:Story', ids: ['story-001'] })]})
    );
  });

  it('should throw "requiredProperty" error if slug, headline or external-id is not provided', () => {
    const Story = {
      'summary': 'Story Summary.',
      'body': '<p>Some Body</p>',
      'story-template': 'text',
      status: 'published',
      'first-published-at': 1597994307759,
      'last-published-at': 1597994307759,
      'published-at': 1597994307759,
      authors: [{ name:'Foo', email: 'author@abc.com', 'external-id': 'author-001'}],
      sections: [{ name:'Foo', slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {required: [expect.objectContaining({ key: 'external-id:Story', ids: [undefined] }),
                    expect.objectContaining({ key: 'headline:Story', ids: [undefined] }),
                    expect.objectContaining({ key: 'slug:Story', ids: [undefined] })]})
    );
  });

  it('should throw "requiredProperty" error if authors, sections or story-template is not provided', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'summary': 'Story Summary.',
      'first-published-at': 1597994307759,
      'last-published-at': 1597994307759,
      'published-at': 1597994307759,
      'body': '<p>Some Body</p>',
      status: 'published'
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {required: [expect.objectContaining({ key: 'sections:Story', ids: ['story-001'] }),
                    expect.objectContaining({ key: 'authors:Story', ids: ['story-001'] }),
                    expect.objectContaining({ key: 'story-template:Story', ids: ['story-001'] })]})
    );
  });

  it('should throw "type" error along with expected type if any of the keys has wrong type', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'summary': 123,
      'story-template': 'text',
      'body': '<p>Some Body</p>',
      status: 'published',
      'first-published-at': 1597994307759,
      'last-published-at': 1597994307759,
      'published-at': 1597994307759,
      authors: 'Foobar',
      sections: [{ slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {type: [expect.objectContaining({ key: 'summary:string', ids: ['story-001'] }),
                expect.objectContaining({ key: 'authors:array', ids: ['story-001'] })]})
    );
  });

  it('should throw "enum" error if any one of the keys have values other than allowed values', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'story-template': 'graphic',
      body: '<p>test</p>',
      status: 'draft',
      'first-published-at': 1597994307759,
      'last-published-at': 1597994307759,
      'published-at': 1597994307759,
      authors: [{ name:'Foo', username:'Foo', email: 'author@abc.com', 'external-id': 'author-001'}],
      sections: [{ name:'Foo', slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {enum: [expect.objectContaining({ key: 'status:open,published', ids: ['story-001'] }),
                expect.objectContaining({ key: 'story-template:text,photo,video,poll,live-blog', ids: ['story-001'] })]})
    );
  });

  it('should throw "additionalProperties" error if any extra key is provided which is not defined in schema', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'summary': 'Story Summary.',
      'body': '<p>Some Body</p>',
      'story-template': 'text',
      status: 'published',
      'first-published-at': 1597994307759,
      'last-published-at': 1597994307759,
      'published-at': 1597994307759,
      authors: [{ email: 'author@abc.com', 'external-id': 1}],
      sections: [{ slug: 'section-slug', 'external-id': 'section-001',
                  'parent': { slug: 'parent-slug' }}],
      tags: [{ name: 'tag' }],
      foo: 'bar'
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {additionalProperties: [expect.objectContaining({ key: 'foo:Story', ids: ['story-001'] })] })
    );
  });

  it('should throw "minItems" error if authors or sections are empty arrays', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'summary': 'Story Summary.',
      'body': '<p>Some Body</p>',
      'story-template': 'text',
      status: 'published',
      'first-published-at': 1597994307759,
      'last-published-at': 1597994307759,
      'published-at': 1597994307759,
      authors: [],
      sections: [],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual(
      expect.objectContaining(
        {minItems: [expect.objectContaining({ key: 'sections:1', ids: ['story-001'] }),
                    expect.objectContaining({ key: 'authors:1', ids: ['story-001']})]})
    );
  });

  it('should throw "Invalid URL" error if incorrect url inside body is present', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'summary': 'Story Summary.',
      'body': '<div><p>Some Body</p><img src="/foo/bar"></div>',
      'story-template': 'text',
      status: 'published',
      'first-published-at': 1020,
      'last-published-at': 1020,
      'published-at': 1020,
      authors: [{ name:'Foo', email: 'author@abc.com', 'external-id': 'author-001'}],
      sections: [{ name:'Foo1', slug: 'section-slug', 'external-id': 'section-001',
                  'parent': { name:'Foo2', slug: 'parent-slug', 'external-id': 'parent-001' }}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual(expect.objectContaining(
      { 'invalidURL': [{ key: 'body: /foo/bar', ids: ['story-001'] }] }));
  });

  it('should validate successfully when all required keys with correct data are provided ', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'summary': 'Story Summary.',
      'body': '<p>Some Body</p>',
      'story-template': 'text',
      status: 'published',
      'first-published-at': 1597040005795,
      'last-published-at': 1597040005795,
      'published-at': 1597040005795,
      authors: [{ name:'Foo', username:'Foo', email: 'author@abc.com', 'external-id': 'author-001'}],
      sections: [{ name:'Foo1', slug: 'section-slug', 'external-id': 'section-001',
                  'parent': { name:'Foo2', slug: 'parent-slug', 'external-id': 'parent-001' }}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {}, new Set());
    expect(output).toEqual({ 'dataType': 'Story', 'total': 1, 'failed': 0, 'successful': 1, 'valid': ['story-001']});
  });

  it('should throw "invalidHeroImage" error if temporary-hero-image-url\'s domain is not valid', () => {
    const type = 'Story';
    const Story1 = {
      'temporary-hero-image-url': 'test.com/wp-content/uploads/2016/11/Last-week-in-parliament-1.jpg',
        name: 'Foobar',
        slug: 'foobar',
        sections: [{ name: 'sec1'}],
        authors: [{ name: 'foobar', username: 'foobar', email: 'foobar@abc.com' }]
    };
    const Story2 = {
      'temporary-hero-image-url': 'http://test.com/wp-content/uploads/2016/11/Last-week-in-parliament-1.jpg',
        name: 'Foobar',
        slug: 'foobar',
        sections: [{ name: 'sec1'}],
        authors: [{ name: 'foobar', username: 'foobar', email: 'foobar@abc.com' }]
    };
    const Story3 = {
     'temporary-hero-image-url': 'localhost:9110/wp-content/uploads/2016/11/Last-week-in-parliament-1.jpg',
      name: 'Foobar',
      slug: 'foobar',
      sections: [{ name: 'sec1'}],
      authors: [{ name: 'foobar', username: 'foobar', email: 'foobar@abc.com' }]
    };
    const Story4 = {
      'temporary-hero-image-url': 'http://localhost:9110/wp-content/uploads/2016/11/Last-week-in-parliament-1.jpg',
       name: 'Foobar',
       slug: 'foobar',
       sections: [{ name: 'sec1'}],
       authors: [{ name: 'foobar', username: 'foobar', email: 'foobar@abc.com' }]
     };
    expect(validateJson(Story1, storySchema, new Set(), type)).toEqual(expect.arrayContaining([expect.objectContaining({
      keyword: 'invalidHeroImage',
      dataPath: '/TemporaryheroImageUrl',
      schemaPath: '',
      params: {
        value: 'test.com/wp-content/uploads/2016/11/Last-week-in-parliament-1.jpg'
      }
    })]));
    expect(validateJson(Story2, storySchema, new Set(), type)).toEqual([]);
    expect(validateJson(Story3, storySchema, new Set(), type)).toEqual(expect.arrayContaining([expect.objectContaining({
      keyword: 'invalidHeroImage',
      dataPath: '/TemporaryheroImageUrl',
      schemaPath: '',
      params: {
        value: 'localhost:9110/wp-content/uploads/2016/11/Last-week-in-parliament-1.jpg'
      }
    })]));
    expect(validateJson(Story4, storySchema, new Set(), type)).toEqual([]);
  });
})
