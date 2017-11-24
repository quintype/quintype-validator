const compression = require('compression');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const amphtmlValidator = require('amphtml-validator');
const Promise = require("bluebird");
const rp = require('request-promise');
const cheerio = require("cheerio");
const URL = require("url");

app.use(compression());
app.use(bodyParser.json());

const ampErrorToMessage = ({line, col, message, specUrl}) => `line ${line}, col ${col}: ${message} ${specUrl ? `(see ${specUrl})` : ""}`

function getAmpUrlFromPage(url, dom) {
  var ampUrl = dom('link[rel=amphtml]').attr('href');

  if(!ampUrl || ampUrl == '') {
    return null;
  }

  if(ampUrl.startsWith('/')) {
    return URL.resolve(url, ampUrl);
  }

  return ampUrl;
}

function runAmpValidator(url, dom) {
  const ampUrl = getAmpUrlFromPage(url, dom);

  if(!ampUrl) {
    return Promise.resolve({
      status: "NA",
      ampUrl: null,
      errors: ["No AMP Page Found"]
    })
  };

  return Promise.all([rp(ampUrl), amphtmlValidator.getInstance()])
    .then(([htmlString, validator]) => {
      const result = validator.validateString(htmlString);
      return {
        status: result.status,
        ampUrl: ampUrl,
        errors: result.errors.filter(({severity}) => severity == "ERROR").map(ampErrorToMessage),
        warnings: result.errors.filter(({severity}) => severity != "ERROR").map(ampErrorToMessage)
      }
    });
}

function validate($, selector, contentAttr, errors, rules = {}) {
  const elements = $(selector);

  if(rules.presence && elements.length == 0)
    return errors.push(`Could not find an element with selector ${selector}`);
  else if (rules.count && elements.length != rules.count)
    return errors.push(`Expected to find ${rules.count} elements with selector ${selector}, got ${elements.length}`)

  elements.each((i, element) => {
    const content = contentAttr == 'body' ? $(element).html() : $(element).attr(contentAttr);
    if(rules.presence && (!content || content == ''))
      return errors.push(`Found an empty ${selector}`)

    if(rules.length_le && content.length > rules.length_le)
      return errors.push(`Content in ${selector} is longer than ${rules.length_le}`)
  });
}

function runSeoValidator(url, dom) {
  var errors = [];
  var warnings = [];

  validate(dom, "head title", 'body', errors, {count: 1, presence: true});

  validate(dom, "body h1", 'body', errors, {count: 1, presence: true});
  validate(dom, "body h1", 'body', warnings, {length_le: 66});

  validate(dom, "meta[name=description]", 'content', errors, {count: 1, presence: true})
  validate(dom, "meta[name=description]", 'content', warnings, {length_le: 160})

  return Promise.resolve({
    status: errors.length == 0 ? "PASS" : "FAIL",
    errors: errors,
    warnings: warnings
  });
}

function runOgTagValidator(url, dom) {
  var errors = [];
  var warnings = [];

  validate(dom, "meta[property=og\\:type]", 'content', errors, {count: 1, presence: true, length_le: 12});
  validate(dom, "meta[property=og\\:title]", 'content', warnings, {count: 1, presence: true, length_le: 66});
  validate(dom, "meta[property=og\\:site_name]", 'content', errors, {count: 1, presence: true, length_le: 30});

  validate(dom, "meta[property=og\\:image]", 'content', errors, {count: 1, presence: true});
  validate(dom, "meta[property=og\\:image\\:height]", 'content', warnings, {count: 1, presence: true});
  validate(dom, "meta[property=og\\:image\\:width]", 'content', warnings, {count: 1, presence: true});

  return Promise.resolve({
    status: errors.length == 0 ? "PASS" : "FAIL",
    errors: errors,
    warnings: warnings
  });
}

app.post("/validate.json", (req, res) => {
  const url = req.body.url;
  rp(url)
    .then(htmlString => cheerio.load(htmlString))
    .then(dom => Promise.all([runAmpValidator(url, dom), runSeoValidator(url, dom), runOgTagValidator(url, dom)]))
    .then(([amp, seo, og]) => {
      res.status(201);
      res.setHeader("Content-Type", "application/json");
      res.json({seo, amp, og});
    })
    .catch(error => {
      res.status(500);
      res.send(error.message);
      console.error(error.stack);
    })
    .finally(() => res.end());
});

module.exports = app;
