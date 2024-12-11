export function copyJson(jsonFile, selector) {
  cy.fixture(jsonFile).then((fixtureContent) => {
    cy.get(selector)
      .clear()
      .type(JSON.stringify(fixtureContent), {
        parseSpecialCharSequences: false,
      });
  });
}
