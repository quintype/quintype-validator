const _ = require("lodash");

const _occurences = (content, keyword) => {
  let matches = content && content.toLowerCase().match(new RegExp(keyword.toLowerCase()));
  return (matches && matches.length) || 0;
};

const _containsKeyword = (content, keyword) => {
  return content && keyword && _occurences(content, keyword) > 0;
};

const _wordCount = content => {
  return content && content.split(/\s+/).filter(word => {
    return word !== "";
  }).length;
};

const _errorType = config => {
    return config['throws']
}

const validatePresence = (ruleConfig, output, data) => {
  if (!data.content || data.content.length === 0) {
    output[_errorType(ruleConfig)].push(`Empty ${data.field}`);
  } else if (data.content.length > 0) {
    output.goodies.push(`You've added ${data.field}`);
  }
};

const validateFocus = (ruleConfig, output, data) => {
  if (!data.focusKeyword) return;
  if (data.content && !_containsKeyword(data.content, data.focusKeyword)) {
    output[_errorType(ruleConfig)].push(
      `The ${data.field} doesn't contain focus keyword '${data.focusKeyword}'.`
    );
  } else {
    output.goodies.push(
      `The ${data.field} contains focus keyword '${data.focusKeyword}'.`
    );
  }
};

const validateImageAltText = (ruleConfig, output, data) => {
  let images = data.content;
  if (images && _.some(images, image => !image["alt-text"])) {
    output[_errorType(ruleConfig)].push("Few images don't contain Alt attribute");
  } else {
    output.goodies.push("You have used Alt attribute in all images");
  }
};

const validateImageAltTextFocus = (ruleConfig, output, data) => {
  let focusKeyword = data.focusKeyword;
  if (!focusKeyword) return;
  let images = data.content;
  let altTexts = images.map(image => image["alt-text"]);
  if (_.some(altTexts, altText => _containsKeyword(altText, focusKeyword))) {
    output.goodies.push(
      `You\'ve used the focus keyword '${focusKeyword}' in the alt tag of an image`
    );
  } else {
    output[_errorType(ruleConfig)].push(
      `You have not used focus keyword '${focusKeyword}' in the alt tag of image`
    );
  }
};

const validateLetterCount = (ruleConfig, output, data) => {
  if (data.content && data.content.length > 0 && data.content.length < ruleConfig.min) {
    output[_errorType(ruleConfig)].push(`The ${data.field} is too short.`);
  } else if (ruleConfig.max && data.content && data.content.length > ruleConfig.max) {
    output[_errorType(ruleConfig)].push(`The ${data.field} is too long.`);
  } else if (
    ruleConfig.min &&
    ruleConfig.max &&
    data.content &&
    data.content.length > ruleConfig.min &&
    data.content.length <= ruleConfig.max
  ) {
    output.goodies.push(`The ${data.field} length is perfect.`);
  }
};

const validateWordCount = (ruleConfig, output, data) => {
  let content = data.content;
  if (
    ruleConfig.min &&
    content &&
    content.length > 0 &&
    _wordCount(content) < ruleConfig.min
  ) {
    output[_errorType(ruleConfig)].push(`The ${data.field} word count is too short.`);
  } else if (content && content.length > 0 && ruleConfig.min) {
    output.goodies.push(`The ${data.field} word count is perfect.`);
  }
};

const validateFocusKeywordDensity = (ruleConfig, output, data) => {
  let focusKeyword = data.focusKeyword;
  if (!focusKeyword) return;
  let keywordOccurencesInContent = _occurences(data.content, focusKeyword);
  let contentWordCount = _wordCount(data.content);
  let keywordDensity = Math.floor(
    ((keywordOccurencesInContent * _wordCount(focusKeyword)) /
      contentWordCount) *
      100
  );

  if (keywordDensity >= 1 && keywordDensity <= 5) {
    output.goodies.push(
      `Your keyword density ${keywordDensity}% is pretty perfect, focus keyword "${focusKeyword}" is used ${keywordOccurencesInContent} time(s)`
    );
  } else {
    let errorMessage =
      contentWordCount < 75
        ? `Unable to calculate a representative keyword density, because of the low number of words (${contentWordCount})`
        : `Your keyword density ${keywordDensity}% is too high, focus keyword '${focusKeyword}' used ${keywordOccurencesInContent} time(s)`;
    output[_errorType(ruleConfig)].push(errorMessage);
  }
};

const soeValidations = {
  presence: validatePresence,
  focus: validateFocus,
  "word-count": validateWordCount,
  "letter-count": validateLetterCount,
  "alt-text": validateImageAltText,
  "alt-focus": validateImageAltTextFocus,
  "focus-keyword-density": validateFocusKeywordDensity
};

module.exports = soeValidations;
