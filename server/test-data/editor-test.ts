/** Section Definition */
export interface SectionTest {
  /** Name of section */
  readonly name: string;
}

/** Author Definition */
export interface AuthorTest {
  /** Name of Author */
  readonly name: string;
}

export interface StoryTest {
  /** Name of story */
  readonly name: string;
  /** List of sections story belongs to */
  readonly sections: ReadonlyArray<SectionTest>;

  /** List of story authors */
  readonly authors: ReadonlyArray<AuthorTest>;
}