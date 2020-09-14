import ValidateStoryPage from '../PageObjects/ValidateStoryPage'
describe('validate Story Files', function() {
    const validateStory= new ValidateStoryPage();
    const URL = "?p=/migrator";
    it('validate story Json with valid story slug and as a direct input',function(){
        cy.visit(URL);
        validateStory.selectStoryType();
        validateStory.clickValidateByField();
        validateStory.selectDirectInput();
        validateStory.fillValidStorySlugJson()
        validateStory.clickValidateButton();
        validateStory.verifyTotalStoryCount("1");
        validateStory.verifyValidStoryCount("1");
    });

    it('validate story Json with invalid story slug and as a direct input',function(){
        cy.visit(URL);
        validateStory.selectStoryType();
        validateStory.clickValidateByField();
        validateStory.selectDirectInput();
        validateStory.fillInValidStorySlugJson();
        validateStory.clickValidateButton();
        validateStory.verifyTotalStoryCount("1");
        validateStory.verifyValidStoryCount("0");
        validateStory.verifyInvalidStoryCount("1");
        validateStory.clickAccordian();
        cy.contains("slug '#design/when-animation-narrates-history' is invalid.");
    });
    
    it('validate story invalid story slug and s3 path as input',function(){
        const s3path = 's3://stg-qt-images/validator/slug-verify';
        cy.visit(URL);
        validateStory.selectStoryType();
        validateStory.clickValidateByField();
        validateStory.selects3Path();
        validateStory.fillS3Path(s3path);
        validateStory.clickValidateButton();
        validateStory.verifyTotalStoryCount("1");
        validateStory.verifyValidStoryCount("0");
        validateStory.verifyInvalidStoryCount("1");
        validateStory.clickAccordian();
        cy.contains("slug '#design/when-animation-narrates-history' is invalid.");
    });    
});