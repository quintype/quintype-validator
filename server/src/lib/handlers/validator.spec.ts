import path, { join } from 'path';
import { validator } from '../utils/validator';

export const typesPath = join(
  path.dirname(require.resolve('@quintype/migration-helpers')),
  'lib',
  'editor-types.d.ts'
);

/* Author validation tests */
describe('authorValidationTest', () => {
  it('should throw "requiredProperty" error if username, external-id is not provided', () => {
    const Author = {
      name: 'Foo Bar',
      email: 'author@abc.com'
    };
    const output = validator('Author', Author, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'external-id:Author', ids: [undefined] }, { key: 'username:Author', ids: [undefined] }]})
    );
  });

  it('should throw "requiredProperty" error if name, email is not provided', () => {
    const Author = {
      username: 'Foo',
      'external-id': 'author-001'
    };
    const output = validator('Author', Author, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'name:Author', ids: ['author-001'] }, { key: 'email:Author', ids: ['author-001'] }]})
    );
  });

  it('should throw "type" error if any of the keys has wrong type', () => {
    const Author = {
      name: 'Foo Bar',
      username: 'Foo',
      email: 'author@abc.com',
      'external-id': 123,
      role: 14
    };
    const output = validator('Author', Author, {});
    expect(output).toEqual(
      expect.objectContaining(
        {type: [{ key: 'external-id:string', ids: [123] }, { key: 'role:string', ids: [123] }]})
    );
  });

  it('should throw "additionalProperties" error if any extra key is provided which is not defined in schema', () => {
    const Author = {
      name: 'Foo Bar',
      username: 'Foo',
      email: 'author@abc.com',
      'external-id': 'author-001',
      role: 'Editor',
      metadata: {
        'address': 'Bangalore'
      },
      foo: 'bar'
    };
    const output = validator('Author', Author, {});
    expect(output).toEqual( expect.objectContaining(
      {additionalProperties: [{ key: 'foo:Author', ids: ['author-001'] }]})
    );
  });

  it('should validate successfully when all required keys with correct datatypes are provided', () => {
    const Author = {
      name: 'Foo Bar',
      username: 'Foo',
      email: 'author@abc.com',
      'external-id': 'author-001',
      role: 'Editor'
    };
    const output = validator('Author', Author, {});
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
    const output = validator('Section', Section, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'external-id:Section', ids: [undefined] }, { key: 'slug:Section', ids: [undefined] }]})
    );
  });

  it('should throw "requiredProperty" error if name is not provided', () => {
    const Section = {
      slug: 'sports',
      'external-id': 'section-001'
    };
    const output = validator('Section', Section, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'name:Section', ids: ['section-001'] }]})
    );
  });

  it('should throw "type" along with expected type error if any of the keys has wrong type', () => {
    const Section = {
      name: 'Sports',
      'display-name': 'sports',
      slug: 123,
      'external-id': 'section-001'
    };
    const output = validator('Section', Section, {});
    expect(output).toEqual(
      expect.objectContaining(
        {type: [{ key: 'slug:string', ids: ['section-001'] }]})
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
    const output = validator('Section', Section, {});
    expect(output).toEqual(
      expect.objectContaining(
        {additionalProperties: [{ key: 'foo:Section', ids: ['section-001'] }]})
    );
  });

  it('should validate successfully when all required keys with correct datatypes are provided', () => {
    const Section = {
      name: 'Sports',
      'display-name': 'sports',
      slug: 'sports',
      'external-id': 'section-001'
    };
    const output = validator('Section', Section, {});
    expect(output).toEqual({ 'dataType': 'Section', 'total': 1, 'failed': 0, 'successful': 1, 'valid': ['section-001']});
  });
})

/* Story validation tests */
describe('storyValidationTest', () => {
  it('should throw "requiredProperty" error if body or publish dates are not provided', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'story-template': 'text',
      status: 'published',
      authors: [{ name:'Foo', email: 'author@foobar', 'external-id': 'author-001'}],
      sections: [{ name:'Foo', slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'body:Story', ids: ['story-001'] },
                    { key: 'first-published-at:Story', ids: ['story-001'] },
                    { key: 'last-published-at:Story', ids: ['story-001'] },
                    { key: 'published-at:Story', ids: ['story-001'] }]})
    );
  });

  it('should throw "requiredProperty" error if slug, headline or external-id is not provided', () => {
    const Story = {
      'summary': 'Story Summary.',
      'body': '<p>Some Body</p>',
      'story-template': 'text',
      status: 'published',
      'first-published-at': 1020,
      'last-published-at': 1020,
      'published-at': 1020,
      authors: [{ name:'Foo', email: 'author@foobar', 'external-id': 'author-001'}],
      sections: [{ name:'Foo', slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'external-id:Story', ids: [undefined] },
                    { key: 'headline:Story', ids: [undefined] },
                    { key: 'slug:Story', ids: [undefined] }]})
    );
  });

  it('should throw "requiredProperty" error if authors, sections or story-template is not provided', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'summary': 'Story Summary.',
      'first-published-at': 1020,
      'last-published-at': 1020,
      'published-at': 1020,
      'body': '<p>Some Body</p>',
      status: 'published'
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'sections:Story', ids: ['story-001'] },
                    { key: 'authors:Story', ids: ['story-001'] },
                    { key: 'story-template:Story', ids: ['story-001'] }]})
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
      'first-published-at': 1020,
      'last-published-at': 1020,
      'published-at': 1020,
      authors: 'Foobar',
      sections: [{ slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {type: [{ key: 'summary:string', ids: ['story-001'] },
                { key: 'authors:array', ids: ['story-001'] }]})
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
      'first-published-at': 1020,
      'last-published-at': 1020,
      'published-at': 1020,
      authors: [{ name:'Foo', email: 'author@foobar', 'external-id': 'author-001'}],
      sections: [{ name:'Foo', slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {enum: [{ key: 'status:open,published', ids: ['story-001'] },
                { key: 'story-template:text,photo,video,poll,live-blog', ids: ['story-001'] }]})
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
      'first-published-at': 1020,
      'last-published-at': 1020,
      'published-at': 1020,
      authors: [{ email: 'author@foobar', 'external-id': 1}],
      sections: [{ slug: 'section-slug', 'external-id': 'section-001',
                  'parent': { slug: 'parent-slug' }}],
      tags: [{ name: 'tag' }],
      foo: 'bar'
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {additionalProperties: [{ key: 'foo:Story', ids: ['story-001'] }] })
    );
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
      'first-published-at': 1020,
      'last-published-at': 1020,
      'published-at': 1020,
      authors: [{ name:'Foo', email: 'author@foobar', 'external-id': 'author-001'}],
      sections: [{ name:'Foo1', slug: 'section-slug', 'external-id': 'section-001',
                  'parent': { name:'Foo2', slug: 'parent-slug', 'external-id': 'parent-001' }}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual({ 'dataType': 'Story', 'total': 1, 'failed': 0, 'successful': 1, 'valid': ['story-001']});
  });
})
