const fs = require("fs");
const config = require("js-yaml").load(fs.readFileSync("config/story-rules.yml"));
const seoValidations = require("./seo_validations");
const _ = require("lodash");

const runRules = (field, content, rules, focusKeyword) => {
  const output = { errors: [], warnings: [], goodies: [] },
    data = { field, content, focusKeyword };
  _.forEach(rules, (ruleConfig, ruleName) => {
    seoValidations[ruleName] &&
      seoValidations[ruleName](ruleConfig, output, data);
  });
  return output;
};

const seoStats = (story, focusKeyword) => {
  const rules = config["seo"].rules;
  const storyFieldsToValidate = Object.keys(story);
  return _.reduce(
    storyFieldsToValidate,
    (output, field) => {
      output[field] = runRules(field, story[field], rules[field], focusKeyword.trim());
      return output;
    },
    {}
  );
};

module.exports = seoStats;
