const fs = require("fs");
const config = require("js-yaml").load(fs.readFileSync("app/story/rules.yml"));
const seoValidations = require("./seo_validations")
const _ = require("lodash");

const runRules = (errorType, rules, output, data) => {
  _.forEach(rules, (ruleConfig, ruleName) => {
    seoValidations[ruleName] && seoValidations[ruleName](errorType, ruleConfig, output, data);
  });
};

const validate = (field, text, rules, focusKeyword) => {
  const output = { errors: [], warnings: [], goodies: [] },
    fieldSpecificRules = {
      errors: rules.errors[field],
      warnings: rules.warnings[field]
    };
    data = {field, text, focusKeyword}
  _.forEach(fieldSpecificRules, (rules, errorType) => runRules(errorType, rules, output, data));
  return output;
};

const seoStats = (story, focusKeyword) => {
  const rules = config["seo"].rules;
  const storyFieldsToValidate = Object.keys(story);
  return _.reduce(
    storyFieldsToValidate,
    function(output, field) {
      output[field] = validate(field, story[field], rules, focusKeyword);
      return output;
    },
    {}
  );
};

module.exports = seoStats;
