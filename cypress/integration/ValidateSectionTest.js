import ValidateSectionPage from "../PageObjects/ValidateSectionPage";
import Validatorutils, * as utils from "../utils/ValidatorUtils"
describe("Validate Author Files", function () {
  const validateSection = new ValidateSectionPage();
  const validatorUtils = new validatorUtils();
  const URL = "?p=/migrator";
  it("validate Section Json as a direct input", function () {
    cy.visit(URL);
    validateSection.selectSectionType();
    validatorUtils.clickValidateByField();
    validatorUtils.selectDirectInput();
    validateSection.fillValidSectionJson();
    validatorUtils.clickValidateButton();
    validateSection.verifyTotalSectionCount("1");
    validateSection.verifyValidSectionCount("1");
  });

  it("validate Section files using S3 path", function () {
    cy.visit(URL);
    const s3path = "s3://stg-qt-images/validator/slug-verify";
    validateSection.selectSectionType();
    validatorUtils.clickValidateByField();
    validatorUtils.selects3Path();
    validatorUtils.fillS3Path(s3path);
    validatorUtils.clickValidateButton();
    validateSection.verifyTotalSectionCount("3");
    validateSection.verifyValidSectionCount("3");
  });
});
