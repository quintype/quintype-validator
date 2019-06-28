const seo = require("../app/story/seo.js");
const expect = require("expect");

describe("seo stats", () => {
  const story = {
    title: "john wick foo content",
    "meta-description": "metadata",
    content:
      "this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then this is my content then",
    images: [
      {
        image: "<img><img>",
        "alt-text": "alt text"
      }
    ]
  };

  expectedSeoStats = {
    title: {
      errors: [],
      warnings: [],
      goodies: [
        "You've added title",
        "The title contains focus keyword 'Content'.",
        "The title length is perfect."
      ]
    },
    "meta-description": {
      errors: ["The meta-description doesn't contain focus keyword 'Content'."],
      warnings: ["The meta-description is too short."],
      goodies: ["You've added meta-description"]
    },
    content: {
      errors: [],
      warnings: ["The content word count is too short."],
      goodies: [
        "You've added content",
        "The content contains focus keyword 'Content'.",
        'Your keyword density 1% is pretty perfect, focus keyword "Content" is used 1 time(s)'
      ]
    },
    images: {
      errors: [
        "You have not used focus keyword 'Content' in the alt tag of image"
      ],
      warnings: [],
      goodies: [
        "You've added images",
        "You have used Alt attribute in all images"
      ]
    }
  };
  expect(seo(story, "Content")).toStrictEqual(expectedSeoStats);
});
