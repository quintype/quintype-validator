import * as utils from "../utils/readJson"
export class Validator{
  selectTypeField='[id="react-select-Select Type"]';
  validateByField='[id="react-select-Validate by"]';
  selectDirectTextInput='#react-select-3-option-0';
  markUpTextArea='[data-test-id="text-area-wrapper"] textarea';
  validateButton ='[data-test-id="emButton"]'
  selectAuthorType() {
    cy.get(this.selectTypeField).click();
    cy.contains("Author").click();
  }
  selectValidateByDirectInput() {
    cy.get(this.validateByField).click();
    cy.get(this.selectDirectTextInput).click({force:true});
  }

  enterAuthorJsonData(){
    utils.copyJson('author.json',this.markUpTextArea);
  }
  clickValidateButton(){
    cy.get(this.validateButton).click();
  }

  verifyComponentsInResultsPage(){
    cy.wait(3000);
    cy.contains("Results");
  }
}
export default Validator;