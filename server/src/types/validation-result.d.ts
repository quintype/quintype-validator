interface ValidationResult {
  readonly status: string;
  readonly errors?: ReadonlyArray<string>;
  readonly warnings?: ReadonlyArray<string>;
  readonly debug?: string | object;
  [others: string]: any;
}
