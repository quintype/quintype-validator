interface ValidationResult {
  readonly status: string;
  readonly errors?: ReadonlyArray<string>;
  readonly warnings?: ReadonlyArray<string>;
  readonly debug?: {readonly [key: string]: any};
  [others: string]: any;
}
