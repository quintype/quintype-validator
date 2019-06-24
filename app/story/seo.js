const fs = require("fs");
const config = require("js-yaml").load(fs.readFileSync("app/story/rules.yml"));
const _ = require("lodash");

function wordCount(s) {
  return s.split(/\s+/).filter(function(word) {
    return word !== "";
  }).length;
}

function validate(text, focus, { group, errors, warnings }) {
  let output = { errors: [], warnings: [], goodies: [] },
    allRules = {
      errors: errors,
      warnings: warnings
    };

  _.forEach(allRules, (rule, ruleName) => {
    if (!rule) return;

    if (rule.presence && (text === null || text.length === 0)) {
      output[ruleName].push(`Empty ${group}`);
    } else if (rule.presence && text.length > 0) {
      output.goodies.push(`You've entered ${group}`);
    }

    if (rule.focus && !text.includes(focus)) {
      output[ruleName].push(`${group} doesn't contain focus keyword.`);
    } else if (rule.focus) {
      output.goodies.push(`${group} contains focus keyword.`);
    }

    if (rule.min_count && text.length > 0 && text.length < rule.min_count) {
      output[ruleName].push(`The ${group} is too short.`);
    } else if (rule.max_count && text.length > rule.max_count) {
      output[ruleName].push(`The ${group} is too long.`);
    } else if (
      rule.min_count &&
      rule.max_count &&
      text.length > rule.min_count &&
      text.length <= rule.max_count
    ) {
      output.goodies.push(`The ${group} length is perfect.`);
    }

    if (rule.min_word_count && text.length > 0 && wordCount(text) < rule.min_word_count) {
      output[ruleName].push(`The ${group} word count is too short.`);
    } else if (text.length > 0 && rule.min_word_count) {
      output.goodies.push(`The ${group} word count is perfect.`);
    }
  });
  return output;
}

function runValidator(story, focus) {
  const rules = config["seo"].rules;
  return _.reduce(
    rules,
    function(output, rule) {
      output[rule.group] = validate(story[rule.group], focus, rule);
      return output;
    },
    {}
  );
}

function getStorySeo(story, focus) {
  return runValidator(story, focus);
}

module.exports = getStorySeo;
