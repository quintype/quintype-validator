import * as utils from "../utils/readJson"
class ValidateStoryPage{

    selectStoryType() {
        cy.contains("Select Type")
        .parent()
        .find(`input`)
        .click({ force: true })
        .type("Story", { force: true });

        cy.wait(1000);

        cy.get(`[class*="__menu"]`)
        .contains("Story")
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

    fillValidStorySlugJson(){
        const markUpTextArea= '[data-test-id="text-area-wrapper"] textarea';
        utils.copyJson('storyWithValidSlug.json',markUpTextArea);
        return this;
      }
    
    clickValidateButton(){
        const validateButton =cy.get('[data-test-id="emButton"]');
        validateButton.click({force:true});
      }
    
    verifyTotalStoryCount(count){
        cy.wait(5000);
        const totalCount = cy.get(':nth-child(1) > .migrator_statistic-reading__2H8Z4')
        totalCount.contains(count);
      }
    verifyValidStoryCount(count){
        const validStoryCount = cy.get(':nth-child(2) > .migrator_statistic-reading__2H8Z4');
        validStoryCount.contains(count);
      }
      fillInValidStorySlugJson(){
        const markUpTextArea= '[data-test-id="text-area-wrapper"] textarea';
        utils.copyJson('storyWithInValidSlug.json',markUpTextArea);
        return this;
      }
}

export default ValidateStoryPage;