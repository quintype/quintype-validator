import ValidateAuthorPage from '../PageObjects/validateAuthorPage'
describe('Validate Author Files', function() {
  const validateAuthor= new ValidateAuthorPage();
  const URL = "?p=/migrator";
  it('validate Author Json as a direct input',function(){
    cy.visit(URL);
    validateAuthor.selectAuthorType();
    validateAuthor.clickValidateByField();
    validateAuthor.selectDirectInput();
    validateAuthor.fillValidAuthorJson();
    validateAuthor.clickValidateButton();
    validateAuthor.verifyTotalAuthorCount("1");
    validateAuthor.verifyValidAuthorCount("1");
  });

  it('validate Author files using S3 path',function(){
    cy.visit(URL);
    const s3path = 's3://stg-qt-images/validator/slug-verify';
    validateAuthor.selectAuthorType();
    validateAuthor.clickValidateByField();
    validateAuthor.selects3Path();
    validateAuthor.fillS3Path(s3path);
    validateAuthor.clickValidateButton();
    validateAuthor.verifyTotalAuthorCount("2");
    validateAuthor.verifyValidAuthorCount("2");
  });
});