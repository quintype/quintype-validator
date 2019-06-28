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
        "caption-text": "alt text"
      }
    ]
  };

  expectedSeoStats = {
    title: {
      errors: [],
      warnings: [],
      goodies: [
        "You've added title",
        "The title contains focus keyword 'content'.",
        "The title length is perfect."
      ]
    },
    "meta-description": {
      errors: ["The meta-description doesn't contain focus keyword 'content'."],
      warnings: ["The meta-description is too short."],
      goodies: ["You've added meta-description"]
    },
    content: {
      errors: [
        "Your keyword density 20% is too high, focus keyword 'content' used 15 time(s)"
      ],
      warnings: ["The content word count is too short."],
      goodies: [
        "You've added content",
        "The content contains focus keyword 'content'."
      ]
    },
    images: {
      errors: [
        "You have not used focus keyword 'content' in the caption of image"
      ],
      warnings: [],
      goodies: ["You've added images", "You have used caption in all images"]
    }
  };
  expect(seo(story, "content")).toStrictEqual(expectedSeoStats);
});
