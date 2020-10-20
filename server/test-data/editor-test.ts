/** Section Definition */
export interface SectionTest {
  /** Name of section */
  readonly name: string;

  /**
   * Slug of section
   * @minLength 1
   * @pattern ^[a-z0-9]+(?:-[a-z0-9]+)*$
   */
  readonly slug?: string;
}

/** Author Definition */
export interface AuthorTest {
  /** Name of Author 
   * @minLength 1
   * @maxLength 10
  */
  readonly name: string;
  readonly username: string;
  readonly email: string;
}

export interface StoryTest {
  /** Name of story */
  readonly name: string;
  /** List of sections story belongs to 
   * @minItems 1
  */
  readonly sections: ReadonlyArray<SectionTest>;

  /** Url of image
   * @format uri
   */
  readonly 'image-url'?: string;

  /** Slug of story */
  readonly slug?: string;

  /** List of story authors */
  readonly authors: ReadonlyArray<AuthorTest>;
  readonly 'temporary-hero-image-url'?: string;
}