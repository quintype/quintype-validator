const validatePresence = (errorType, config, output, data) => {
  text = data.text
  field = data.field
  if (!text || text.length === 0) {
    output[errorType].push(`Empty ${field}`);
  } else if (text.length > 0) {
    output.goodies.push(`You've entered ${field}`);
  }
};

const validateFocus = (errorType, config, output, data) => {
    text = data.text
    field = data.field
    if (text && !text.includes(data.focusKeyword)) {
        output[errorType].push(`${field} doesn't contain focus keyword.`);
      } else if (rule.focus) {
        output.goodies.push(`${field} contains focus keyword.`);
      }
};

const validateLetterCount = (errorType, config, output, data) => {
    text = data.text
    field = data.field
    if (text && text.length > 0 && text.length < config.min) {
        output[errorType].push(`The ${field} is too short.`);
      } else if (config.max && text && text.length > config.max) {
        output[errorType].push(`The ${field} is too long.`);
      } else if (
        config.min &&
        config.max &&
        text &&
        text.length > config.min &&
        text.length <= config.max
      ) {
        output.goodies.push(`The ${field} length is perfect.`);
      }
};

const wordCount = (text) => {
    return text.split(/\s+/).filter((word) => {
      return word !== "";
    }).length;
  }

const validateWordCount = (errorType, config, output, data) => {
    text = data.text
    field = data.field
    if (config.min && text && text.length > 0 && wordCount(text) < config.min) {
        output[errorType].push(`The ${field} word count is too short.`);
      } else if (text && text.length > 0 && config.min) {
        output.goodies.push(`The ${field} word count is perfect.`);
      }
};

const valadations = {
  presence: validatePresence,
  focus: validateFocus,
  "word_count": validateWordCount,
  "letter_count": validateLetterCount
};

module.exports = valadations;
