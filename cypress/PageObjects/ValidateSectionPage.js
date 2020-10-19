import * as utils from "../utils/readJson"
class ValidateSectionPage{
  selectSectionType() {
    cy.contains("Select Type")
      .parent()
      .find(`input`)
      .click({ force: true })
      .type("Section", { force: true });
    cy.wait(1000);
    cy.get(`[class*="__menu"]`)
      .contains("Section")
      .click();
    return this;
  }

  clickValidateByField(){
    const validateByField = cy.get('[id="react-select-Validate by"]');
    validateByField.click();
    return this;
  }
  
  selectDirectInput(){
    const directInput = cy.get('#react-select-3-option-0');
    directInput.click();
    return this;
  }

  fillValidSectionJson(){
    const markUpTextArea= '[data-test-id="text-area-wrapper"] textarea';
    utils.copyJson('validSection.json',markUpTextArea);
    return this;
  }
    
  clickValidateButton(){
    const validateButton =cy.get('[data-test-id="emButton"]');
    validateButton.click({force:true});
    return this;
  }

  verifyTotalSectionCount(count){
    cy.wait(10000);
    const totalCount = cy.get(':nth-child(1) > .migrator_statistic-reading__2H8Z4')
    totalCount.eq(0).contains(count);
    return this;
  }

  verifyValidSectionCount(count){
    const validStoryCount = cy.get(':nth-child(2) > .migrator_statistic-reading__2H8Z4');
    validStoryCount.contains(count);
    return this;
  }

  selects3Path(){
    const fileUpload = cy.get('#react-select-3-option-2');
    fileUpload.click();
    return this;
  }

  fillS3Path(s3Path){  
    const s3PathField = cy.get('[data-test-id="text-area-Type url here"]');
    s3PathField.type(s3Path);
    return this;
  }
}
export default ValidateSectionPage;