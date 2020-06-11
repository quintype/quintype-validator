import {Validator} from "../pages/validate.page";
describe("Validate Author", function() {
    var URL = "?p=/migrator";
    const validateAuthor = new Validator();
  
    it("Should verify validator page with type Author", function() {  
      cy.visit(URL);
      validateAuthor.selectAuthorType();
      validateAuthor.selectValidateByDirectInput();
      validateAuthor.enterAuthorJsonData();
      validateAuthor.clickValidateButton();
      validateAuthor.verifyComponentsInResultsPage();
    });
});