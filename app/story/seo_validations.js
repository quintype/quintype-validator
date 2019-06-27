const _ = require("lodash");

const _occurences = (content, keyword) => {
  let matches = content.toLowerCase().match(new RegExp(keyword.toLowerCase()));
  return (matches && matches.length) || 0;
};

const _containsKeyword = (content, keyword) => {
  return content && keyword && _occurences(content, keyword) > 0;
};

const _wordCount = content => {
  return content.split(/\s+/).filter(word => {
    return word !== "";
  }).length;
};

const validatePresence = (errorType, config, output, data) => {
  if (!data.content || data.content.length === 0) {
    output[errorType].push(`Empty ${data.field}`);
  } else if (data.content.length > 0) {
    output.goodies.push(`You've added ${data.field}`);
  }
};

const validateFocus = (errorType, config, output, data) => {
  if (!data.focusKeyword) return;
  if (data.content && !_containsKeyword(data.content, data.focusKeyword)) {
    output[errorType].push(
      `The ${data.field} doesn't contain focus keyword '${data.focusKeyword}'.`
    );
  } else {
    output.goodies.push(
      `The ${data.field} contains focus keyword '${data.focusKeyword}'.`
    );
  }
};

const validateImageAltText = (errorType, config, output, data) => {
  let images = data.content;
  if (images && _.some(images, image => !image["alt-text"])) {
    output[errorType].push("Few images don't contain Alt attribute");
  } else {
    output.goodies.push("You have used Alt attribute in all images");
  }
};

const validateImageAltTextFocus = (errorType, config, output, data) => {
  let focusKeyword = data.focusKeyword;
  if (!focusKeyword) return;
  let images = data.content;
  let altTexts = images.map(image => image["alt-text"]);
  if (_.some(altTexts, altText => _containsKeyword(altText, focusKeyword))) {
    output.goodies.push(
      `You\'ve used the focus keyword '${focusKeyword}' in the alt tag of an image`
    );
  } else {
    output[errorType].push(
      `You have not used focus keyword '${focusKeyword}' in the alt tag of image`
    );
  }
};

const validateLetterCount = (errorType, config, output, data) => {
  if (data.content && data.content.length > 0 && data.content.length < config.min) {
    output[errorType].push(`The ${data.field} is too short.`);
  } else if (config.max && data.content && data.content.length > config.max) {
    output[errorType].push(`The ${data.field} is too long.`);
  } else if (
    config.min &&
    config.max &&
    data.content &&
    data.content.length > config.min &&
    data.content.length <= config.max
  ) {
    output.goodies.push(`The ${data.field} length is perfect.`);
  }
};

const validateWordCount = (errorType, config, output, data) => {
  let content = data.content;
  if (
    config.min &&
    content &&
    content.length > 0 &&
    _wordCount(content) < config.min
  ) {
    output[errorType].push(`The ${data.field} word count is too short.`);
  } else if (content && content.length > 0 && config.min) {
    output.goodies.push(`The ${data.field} word count is perfect.`);
  }
};

const validateFocusKeywordDensity = (errorType, config, output, data) => {
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
    output[errorType].push(errorMessage);
  }
};

const validations = {
  presence: validatePresence,
  focus: validateFocus,
  "word-count": validateWordCount,
  "letter-count": validateLetterCount,
  "alt-text": validateImageAltText,
  "alt-focus": validateImageAltTextFocus,
  "focus-keyword-density": validateFocusKeywordDensity
};

module.exports = validations;
