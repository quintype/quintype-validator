const _ = require("lodash");

const _containsKeyword = (content, keyword) => {
    return content && keyword && content.toLowerCase().includes(keyword.toLowerCase())
}

const _wordCount = (content) => {
    return content.split(/\s+/).filter((word) => {
      return word !== "";
    }).length;
  }

const validatePresence = (errorType, config, output, data) => {
  content = data.content
  field = data.field
  if (!content || content.length === 0) {
    output[errorType].push(`Empty ${field}`);
  } else if (content.length > 0) {
    output.goodies.push(`You've added ${field}`);
  }
};

const validateFocus = (errorType, config, output, data) => {
    focusKeyword = data.focusKeyword
    if(!focusKeyword) return
    content = data.content
    field = data.field
    if (content && !_containsKeyword(content, focusKeyword)) {
        output[errorType].push(`The ${field} doesn't contain focus keyword '${focusKeyword}'.`);
      } else {
        output.goodies.push(`The ${field} contains focus keyword '${focusKeyword}'.`);
      }
};

const validateImageAltText = (errorType, config, output, data) => {
    images = data.content
    if (images && _.some(images, (image) => !image.alt_text)) {
        output[errorType].push("Few images don't contain Alt attribute");
      } else {
        output.goodies.push('You have used Alt attribute in all images');
      }
}

const validateImageAltTextFocus = (errorType, config, output, data) => {
    focusKeyword = data.focusKeyword
    if(!focusKeyword) return
    images = data.content
    altTexts = images.map((image) => image["alt-text"])   
    if(_.some(altTexts, (altText) => _containsKeyword(altText, focusKeyword))){
        output.goodies.push(`You\'ve used the focus keyword '${focusKeyword}' in the alt tag of an image`)
    }else{
        output[errorType].push(`You have not used focus keyword '${focusKeyword}' in the alt tag of image`)   
    }
}

const validateLetterCount = (errorType, config, output, data) => {
    content = data.content
    field = data.field
    if (content && content.length > 0 && content.length < config.min) {
        output[errorType].push(`The ${field} is too short.`);
      } else if (config.max && content && content.length > config.max) {
        output[errorType].push(`The ${field} is too long.`);
      } else if (
        config.min &&
        config.max &&
        content &&
        content.length > config.min &&
        content.length <= config.max
      ) {
        output.goodies.push(`The ${field} length is perfect.`);
      }
};

const validateWordCount = (errorType, config, output, data) => {
    content = data.content
    field = data.field
    if (config.min && content && content.length > 0 && _wordCount(content) < config.min) {
        output[errorType].push(`The ${field} word count is too short.`);
      } else if (content && content.length > 0 && config.min) {
        output.goodies.push(`The ${field} word count is perfect.`);
      }
};

const valadations = {
  presence: validatePresence,
  focus: validateFocus,
  "word_count": validateWordCount,
  "letter_count": validateLetterCount,
  "alt_text": validateImageAltText,
  "alt_focus": validateImageAltTextFocus
};

module.exports = valadations;
