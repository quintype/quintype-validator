# Quintype Validator

This tool can be used to validate any Quintype page. This is currently deployed at [https://validator.staging.quintype.com](https://validator.staging.quintype.com).

## Validatations

The tool runs multiple validators, and reports the output of each stage. Warnings conditions are mentioned in (parenthesis)

### AMP

The following AMP validations are run:
* Checks that there is an AMP url present
* Checks that the AMP html is valid using the [amphtml-validator](https://www.npmjs.com/package/amphtml-validator)

### SEO

Please see [rules.yml](config/rules.yml) for a list of rules that are run

### OG Tags

Please see [rules.yml](config/rules.yml) for a list of rules that are run

### Headers

Please see [rules.yml](config/rules.yml) for a list of rules that are run

### Structured Data

The following Structured Data validations are run:
* Check the structured data with the [Structured Data Tool](https://search.google.com/structured-data/testing-tool). Note: this API is undocumented, and has a high failure rate
* Presence of at least one Object

## Links

The API also returns a list of links. A crawler can be written which calls the validation API, recieves a list of linked pages, then continues validating the next page.
