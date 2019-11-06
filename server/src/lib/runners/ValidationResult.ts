export interface ValidationResult {
  readonly status: string;
  readonly errors?: ReadonlyArray<string>;
  readonly warnings?: ReadonlyArray<string>;
  readonly debug?: object;
}
