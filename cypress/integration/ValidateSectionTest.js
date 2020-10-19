import ValidateSectionPage from '../PageObjects/ValidateSectionPage'
describe('Validate Author Files', function() {
  const validateSection= new ValidateSectionPage();
  const URL = "?p=/migrator";
  it('validate Section Json as a direct input',function(){
    cy.visit(URL);
    validateSection.selectSectionType();
    validateSection.clickValidateByField();
    validateSection.selectDirectInput();
    validateSection.fillValidSectionJson();
    validateSection.clickValidateButton();
    validateSection.verifyTotalSectionCount("1");
    validateSection.verifyValidSectionCount("1");
  });

  it('validate Section files using S3 path',function(){
    cy.visit(URL);
    const s3path = 's3://stg-qt-images/validator/slug-verify';
    validateSection.selectSectionType();
    validateSection.clickValidateByField();
    validateSection.selects3Path();
    validateSection.fillS3Path(s3path);
    validateSection.clickValidateButton();
    validateSection.verifyTotalSectionCount("3");
    validateSection.verifyValidSectionCount("3");
  });
});