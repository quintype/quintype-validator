import * as utils from "../utils/readJson"
//import 'cypress-file-upload';
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
        return this;
      }
    
    verifyTotalStoryCount(count){
        cy.wait(5000);
        const totalCount = cy.get(':nth-child(1) > .migrator_statistic-reading__2H8Z4')
        totalCount.eq(0).contains(count);
        return this;
      }
    verifyValidStoryCount(count){
        const validStoryCount = cy.get(':nth-child(2) > .migrator_statistic-reading__2H8Z4');
        validStoryCount.contains(count);
        return this;
      }
    verifyInvalidStoryCount(count){
        const invalidStoryCount = cy.get(':nth-child(3) > .migrator_statistic-reading__2H8Z4')
        invalidStoryCount.contains(count);
        return this;
    }
    fillInValidStorySlugJson(){
        const markUpTextArea= '[data-test-id="text-area-wrapper"] textarea';
        utils.copyJson('storyWithInValidSlug.json',markUpTextArea);
        return this;
      }
    clickAccordian(){
        const arrowAccordian = cy.get('.accordion-section_accordion-arrow__3AFqH > svg');
        arrowAccordian.click();
        return this;
    }

    selectFileUpload(){
        const fileUpload = cy.get('#react-select-3-option-1');
        fileUpload.click();
        return this;
    }
    selects3Path(){
        const fileUpload = cy.get('#react-select-3-option-2');
        fileUpload.click();
        return this;
    }

    fillS3Path(s3Path)
    {
        const s3PathField = cy.get('[data-test-id="text-area-Type url here"]');
        s3PathField.type(s3Path);
        return this;
    }

    fileUpload(){
        const invalistoryslugfile = 'story-WithInvalidSlug-00001.txt.gz';
        const uploadButton = cy.get('[for="upload-file-btn"]');
        cy.fixture(invalistoryslugfile, 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then((fileContent) => {
        uploadButton.attachFile({ fileContent, fileName: 'invalistoryslugfile', mimeType: 'application/octet-stream', encoding: 'utf-8' });
        })
        cy.wait(2000);
        return this;
    }



}

export default ValidateStoryPage;