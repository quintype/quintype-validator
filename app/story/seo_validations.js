const _ = require("lodash");

const _occurences = (content, keyword) => {
  let matches = content && content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g'));
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
  if (!data.focusKeyword || data.content.length === 0) return;
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

const validateImageCaptionText = (ruleConfig, output, data) => {
  let images = data.content;
  if (images.length === 0) return
  if (images && _.some(images, image => !image["caption-text"])) {
    output[_errorType(ruleConfig)].push("Few images don't contain caption");
  } else {
    output.goodies.push("You have used caption in all images");
  }
};

const validateImageCaptionTextFocus = (ruleConfig, output, data) => {
  let focusKeyword = data.focusKeyword;
  let captionTexts = data.content.map(image => image["caption-text"]).filter((text) => text);
  if (!focusKeyword || captionTexts.length === 0) return;
  if (_.some(captionTexts, captionText => _containsKeyword(captionText, focusKeyword))) {
    output.goodies.push(
      `You\'ve used the focus keyword '${focusKeyword}' in the caption of an image`
    );
  } else {
    output[_errorType(ruleConfig)].push(
      `You have not used focus keyword '${focusKeyword}' in the caption of image`
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
      `Your keyword density ${keywordDensity}% is perfect, focus keyword "${focusKeyword}" is used ${keywordOccurencesInContent} time(s)`
    );
  } else if (keywordDensity > 0) {
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
  "caption-text": validateImageCaptionText,
  "caption-focus": validateImageCaptionTextFocus,
  "focus-keyword-density": validateFocusKeywordDensity
};

module.exports = soeValidations;
