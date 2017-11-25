const compression = require('compression');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const amphtmlValidator = require('amphtml-validator');
const Promise = require("bluebird");
const rp = require('request-promise');
const cheerio = require("cheerio");
const URL = require("url");
const _ = require("lodash");

app.use(compression());
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static("public", {maxage: 86400000}));

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

function runAmpValidator(dom, url) {
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
        warnings: result.errors.filter(({severity}) => severity != "ERROR").map(ampErrorToMessage),
        debug: {"Amp Url": ampUrl}
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

function runSeoValidator(dom) {
  var errors = [];
  var warnings = [];

  validate(dom, "head title", 'body', errors, {count: 1, presence: true});

  validate(dom, "body h1", 'body', errors, {count: 1, presence: true});
  validate(dom, "body h1", 'body', warnings, {length_le: 66});

  validate(dom, "meta[name=description]", 'content', errors, {count: 1, presence: true})
  validate(dom, "meta[name=description]", 'content', warnings, {length_le: 160})

  return {
    status: errors.length == 0 ? "PASS" : "FAIL",
    errors: errors,
    warnings: warnings
  };
}

function runOgTagValidator(dom) {
  var errors = [];
  var warnings = [];

  validate(dom, "meta[property=og\\:type]", 'content', errors, {count: 1, presence: true, length_le: 12});
  validate(dom, "meta[property=og\\:title]", 'content', warnings, {count: 1, presence: true, length_le: 66});
  validate(dom, "meta[property=og\\:site_name]", 'content', warnings, {count: 1, presence: true, length_le: 30});

  validate(dom, "meta[property=og\\:image]", 'content', errors, {count: 1, presence: true});
  validate(dom, "meta[property=og\\:image\\:height]", 'content', warnings, {count: 1, presence: true});
  validate(dom, "meta[property=og\\:image\\:width]", 'content', warnings, {count: 1, presence: true});

  return {
    status: errors.length == 0 ? "PASS" : "FAIL",
    errors: errors,
    warnings: warnings
  };
}

function validateHeader(headers, header, regex, errors) {
  const value = headers[header.toLowerCase()];

  if(!value || value == '')
    return errors.push(`Could not find header ${header}`);

  if(!value.match(regex))
    return errors.push(`Expected header ${header} to match ${regex} (got ${value})`);
}

function runHeaderValidator(dom, url, response) {
  const headers = response.headers;

  var errors = [];
  var warnings = [];

  validateHeader(headers, 'Cache-Control', /public, ?max-age=\d+/, errors);
  validateHeader(headers, 'Vary', /Accept-Encoding/, errors);
  validateHeader(headers, 'Surrogate-Control', /public, ?max-age=\d+, ?stale-while-revalidate=\d+, ?stale-if-error=\d+/, errors);
  validateHeader(headers, 'Surrogate-Key', /./, warnings);

  if(headers["set-cookie"]) {
    errors.push("Illegal Header Set-Cookie found");
  }

  validateHeader(headers, 'Content-Encoding', /gzip/, errors);

  return {
    status: errors.length == 0 ? "PASS" : "FAIL",
    errors: errors,
    warnings: warnings,
    debug: _.pick(headers,['cache-control', 'vary', 'surrogate-key', 'surrogate-control', 'set-cookie', 'content-encoding'])
  };
}

const structuredErrorToMessage = ({ownerSet, errorType, args, begin, end}) => `[${_.keys(ownerSet).join(" ")}] ${errorType} ${args.join(" ")} (${begin} - ${end})`;

function runStructuredDataValidator(dom, url) {
  return rp.post("https://search.google.com/structured-data/testing-tool/validate", {
    form: {url: url}
  })
  .then(body => JSON.parse(body.substring(body.indexOf("{"))))
  .then(({errors, numObjects, contentId, url}) => {
    const actualErrors = errors.filter(error => error.isSevere).map(structuredErrorToMessage);
    const warnings = errors.filter(error => !error.isSevere).map(structuredErrorToMessage);

    if(!contentId) {
      warnings.push("No ContentId was found");
    }

    var status;
    if(actualErrors.length > 0)
      status = "FAIL";
    else if (numObjects == 0)
      status = "NA";
    else
      status = "PASS";
    return {errors: actualErrors, warnings, numObjects, contentId, url, status};
  }).catch(e => ({
    status: "ERROR",
    debug: {error: e.message}
  }));
}

function fetchLinks($, url) {
  const links = $('a[href]').map((index, element) => URL.resolve(url, $(element).attr("href"))).get();
  return _(links).filter(link => link.startsWith("http")).uniq().value();
}

const RUNNERS = [runAmpValidator, runStructuredDataValidator, runSeoValidator, runOgTagValidator, runHeaderValidator, fetchLinks];

app.post("/api/validate.json", (req, res) => {
  const url = req.body.url;
  rp(url, {
    headers: {"Fastly-Debug": "1"},
    resolveWithFullResponse: true,
    gzip: true
  })
    .then(response => ({response: response, dom: cheerio.load(response.body)}))
    .then(({response, dom}) => Promise.all(RUNNERS.map(runner => runner(dom, url, response))))
    .then(([amp, structured, seo, og, headers, links]) => {
      res.status(201);
      res.setHeader("Content-Type", "application/json");
      res.json({
        url: url,
        results: {seo, amp, og, headers, structured},
        links: links
      });
    })
    .catch(error => {
      res.status(500);
      res.setHeader("Content-Type", "application/json");
      res.json({error: {message: error.message}});
      console.error(error.stack);
    })
    .finally(() => res.end());
});

const fs = require("fs");
const assets = JSON.parse(fs.readFileSync("asset-manifest.json"));

function assetPath(asset) {
  return assets[asset];
}

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public,max-age=60");
  res.render("index", {
    assetPath: assetPath
  })
});

app.get("/ping", (req, res) => res.send("pong"));

module.exports = app;
