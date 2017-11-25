# Quintype Validator

This tool can be used to validate any Quintype page. This is currently deployed at [https://validator.staging.quintype.com](https://validator.staging.quintype.com).

## Validatations

The tool runs multiple validators, and reports the output of each stage. Warnings conditions are mentioned in (parenthesis)

### AMP

The following AMP validations are run:
* Checks that there is an AMP url present
* Checks that the AMP html is valid using the [amphtml-validator](https://www.npmjs.com/package/amphtml-validator)

### SEO

The following SEO validations are run:
* The page should have exactly one title (length < 66)
* The page should have exactly one h1 (length < 66)
* The page should have exactly one meta description (length < 160)

### OG Tags

The following OG Tag validations are run:
* The page should have exactly one og:title (length < 66)
* The page should have exactly one og:site_name (length < 12)
* The page should have exactly one og:image (and og:image:height / og:image:width)

### Headers

The following Header validations are run:
* Presence of Cache-Control with public,max-age
* Presence of Surrogate-Control with public,max-age,stale-while-revalidate,stale-if-error
* Presence of Vary with Accept-Encoding
* Absence of a Set-Cookie header
* (Presence of a Surrogate-Key)
* Presence of Content-Encoding with gzip

### Structured Data

The following Structured Data validations are run:
* Check the structured data with the [Structured Data Tool](https://search.google.com/structured-data/testing-tool). Note: this API is undocumented, and has a high failure rate
* Presence of at least one Object

## Links

The API also returns a list of links. A crawler can be written which calls the validation API, recieves a list of linked pages, then continues validating the next page.
