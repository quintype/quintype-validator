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

  it('should validate successfully when all required keys with correct datatypes are provided', () => {
    const Author = {
      name: 'Foo Bar',
      username: 'Foo',
      email: 'author@abc.com',
      'external-id': 'author-001',
      role: 'Editor'
    };
    const output = validator('Author', Author, {});
    expect(output).toEqual({ 'total': 1, 'successful': 1, 'valid': ['author-001']});
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

  it('should validate successfully when all required keys with correct datatypes are provided', () => {
    const Section = {
      name: 'Sports',
      'display-name': 'sports',
      slug: 'sports',
      'external-id': 'section-001'
    };
    const output = validator('Section', Section, {});
    expect(output).toEqual({ 'total': 1, 'successful': 1, 'valid': ['section-001']});
  });
})

/* Story validation tests */
describe('storyValidationTest', () => {
  it('should throw "requiredProperty" error if any one of body, cards or story-elements is not provided', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'story-template': 'text',
      status: 'published',
      authors: [{ email: 'author@foobar', 'external-id': 'author-001'}],
      sections: [{ slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'any one of body, story-elements and cards', ids: ['story-001'] }]})
    );
  });

  it('should throw "requiredProperty" error if slug, headline or external-id is not provided', () => {
    const Story = {
      'summary': 'Story Summary.',
      'body': '<p>Some Body</p>',
      'story-template': 'text',
      status: 'published',
      authors: [{ email: 'author@foobar', 'external-id': 'author-001'}],
      sections: [{ slug: 'section-slug', 'external-id': 'section-001'}],
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
      status: 'draft',
      authors: [{ email: 'author@foobar', 'external-id': 'author-001'}],
      sections: [{ slug: 'section-slug', 'external-id': 'section-001'}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {enum: [{ key: 'status:open,published', ids: ['story-001'] },
                { key: 'story-template:text,photo,video', ids: ['story-001'] }]})
    );
  });

  it('should throw error with key path if any of the sub parts are incorrect', () => {
    const Story = {
      'external-id': 'story-001',
      headline: 'A story headline',
      slug: 'story-slug',
      'summary': 'Story Summary.',
      'body': '<p>Some Body</p>',
      'story-template': 'text',
      status: 'published',
      authors: [{ email: 'author@foobar', 'external-id': 1}],
      sections: [{ slug: 'section-slug', 'external-id': 'section-001',
                  'parent': { slug: 'parent-slug' }}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual(
      expect.objectContaining(
        {required: [{ key: 'external-id:sections/parent', ids: ['story-001'] }],
         type: [{ key: 'authors/external-id:string', ids: ['story-001'] }]})
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
      authors: [{ email: 'author@foobar', 'external-id': 'author-001'}],
      sections: [{ slug: 'section-slug', 'external-id': 'section-001',
                  'parent': { slug: 'parent-slug', 'external-id': 'parent-001' }}],
      tags: [{ name: 'tag' }]
    };
    const output = validator('Story', Story, {});
    expect(output).toEqual({ 'total': 1, 'successful': 1, 'valid': ['story-001']});
  });
})
