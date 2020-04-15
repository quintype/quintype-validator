/** Section Definition */
export interface SectionTest {
  /** Name of section */
  readonly name: string;
}

/** Author Definition */
export interface AuthorTest {
  /** Name of Author 
   * @minLength 1
   * @maxLength 10
  */
  readonly name: string;
}

export interface StoryTest {
  /** Name of story */
  readonly name: string;
  /** List of sections story belongs to 
   * @minItems 1
  */
  readonly sections: ReadonlyArray<SectionTest>;

  /** List of story authors */
  readonly authors: ReadonlyArray<AuthorTest>;
}