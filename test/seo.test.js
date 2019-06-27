const seo = require("../app/story/seo_new.js");
const assert = require("assert");

describe("seo stats", () => {
  const story = {
    title: "john wick foo",
    "meta-description": "metadata",
    content: "this is my content then",
    images: {
      image: "<img><img>",
      "alt-text": "alt text"
    }
  };

  expectedSeoStats = {
    title: {
      errors: ["title doesn't contain focus keyword."],
      warnings: [],
      goodies: ["You've entered title", "The title length is perfect."]
    },
    "meta-description": {
      errors: ["meta-description doesn't contain focus keyword."],
      warnings: ["The meta-description is too short."],
      goodies: ["You've entered meta-description"]
    },
    content: {
      errors: ["content doesn't contain focus keyword."],
      warnings: ["The content word count is too short."],
      goodies: ["You've entered content"]
    },
    images: {
      errors: [],
      warnings: [],
      goodies: []
    }
  };
  assert.deepEqual(seo(story), expectedSeoStats)
});
