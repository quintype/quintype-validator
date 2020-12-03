class ValidatorUtils {
    clickValidateByField() {
        const validateByField = cy.get('[id="react-select-Validate by"]');
        validateByField.click();
        return this;
    }
    
    selectDirectInput() {
        const directInput = cy.get("#react-select-3-option-0");
        directInput.click();
        return this;
    }

    clickValidateButton() {
        const validateButton = cy.get('[data-test-id="emButton"]');
        validateButton.click({ force: true });
        return this;
    }
    selects3Path() {
        const fileUpload = cy.get("#react-select-3-option-2");
        fileUpload.click();
        return this;
    }
    
    fillS3Path(s3Path) {
        const s3PathField = cy.get('[data-test-id="text-area-Type url here"]');
        s3PathField.type(s3Path);
        return this;
    }
}
export default ValidatorUtils;
