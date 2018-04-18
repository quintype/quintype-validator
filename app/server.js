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
const fs = require("fs");
const config = require("js-yaml").load(fs.readFileSync("config/rules.yml"));
const robotsParser = require('robots-parser');

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

function validateHeader(headers, {header, errors, warnings}, url, outputLists) {
  const value = headers[header.toLowerCase()];

  if(value) {
    outputLists.debug[header] = value;
  }

  [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(([rules, outputList]) => {
    if(!rules)
      return;

    if(rules.presence && (!value || value == ''))
      return outputList.push(`Could not find header ${header}`);

    if(rules.absence && value)
      return outputList.push(`Found header that should be absent ${header}`)

    if(rules.regex && !value.match(rules.regex))
      return outputList.push(`Expected header ${header} to match ${rules.regex} (got ${value})`)
  })
}

function validateDom($, {selector, contentAttr, errors, warnings}, url, outputLists) {
  const elements = $(selector);

  [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(([rules, outputList]) => {
    if(!rules)
      return;

    if(rules.presence && elements.length == 0)
      return outputList.push(`Could not find an element with selector ${selector}`);

    if(rules.count != null && elements.length != rules.count)
      return outputList.push(`Expected to find ${rules.count} elements with selector ${selector}, got ${elements.length}`);

    elements.each((i, element) => {
      const content = (contentAttr == 'body' ? $(element).html() : $(element).attr(contentAttr)) || '';
      if(rules.presence && (!content || content == ''))
        return outputList.push(`Found an empty ${selector}`)

      if(rules.length_le && content.length > rules.length_le)
        return outputList.push(`Content in ${selector} is longer than ${rules.length_le}`);

      if(rules.value == 'url' && content != url) {
        return outputList.push(`Content in ${selector} should have value ${url} (got ${content})`);
      }
    });
  });
}

function runValidator(category, dom, url, response) {
  var errors = [];
  var warnings = [];
  const debug = {};
  const rules = config[category].rules;

  rules.forEach(rule => {
    switch(rule.type) {
      case 'header':
        validateHeader(response.headers, rule, url, {errors, warnings, debug});
        break;
      case 'dom':
        validateDom(dom, rule, url, {errors, warnings, debug})
        break;
      default:
        throw `Unknown rule type: ${rule.type}`;
    }
  });

  return {status: errors.length == 0 ? "PASS" : "FAIL", errors, warnings, debug};
}

function runSeoValidator(dom, url, response) {
  return runValidator('seo', dom, url, response);
}

function runHeaderValidator(dom, url, response) {
  return runValidator('headers', dom, url, response);
}

function runOgTagValidator(dom, url, response) {
  return runValidator('og', dom, url, response);
}


const BOTS = ["GoogleBot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider"];
function runRobotsValidator(dom, url, response) {
  const robotsUrl = URL.resolve(url, "/robots.txt");
  return rp(robotsUrl, {
    resolveWithFullResponse: true,
    gzip: true,
    simple: false
  }).then(response => {
    if(response.statusCode != 200) {
      return {status: "FAIL", errors: [`Status Code Was ${response.statusCode}`], debug: {statusCode: response.statusCode}};
    } else {
      const robots = robotsParser(robotsUrl, response.body);
      const errors = BOTS.filter(bot => !robots.isAllowed(url, bot))
                         .map(bot => `${bot} was not allowed to crawl this page`);

      const sitemaps = robots.getSitemaps();
      if(sitemaps.length == 0) {
        errors.push("There was no sitemap configured");
      }

      const debug = {content: response.body, sitemaps: sitemaps.join(","), lineNo: robots.getMatchingLineNumber(url)};

      if(errors.length == 0) {
        return {status: "PASS", debug: debug};
      } else {
        return {status: "FAIL", errors: errors, debug: debug};
      }
    }
  });
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

const RUNNERS = [runAmpValidator, runStructuredDataValidator, runSeoValidator, runOgTagValidator, runHeaderValidator, runRobotsValidator, fetchLinks];

app.post("/api/validate.json", (req, res) => {
  const url = req.body.url;
  rp(url, {
    headers: {"Fastly-Debug": "1"},
    resolveWithFullResponse: true,
    gzip: true
  })
    .then(response => ({response: response, dom: cheerio.load(response.body)}))
    .then(({response, dom}) => Promise.all(RUNNERS.map(runner => runner(dom, url, response))))
    .then(([amp, structured, seo, og, headers, robots, links]) => {
      res.status(201);
      res.setHeader("Content-Type", "application/json");
      res.json({
        url: url,
        results: {seo, amp, og, headers, robots, structured},
        links: links
      });
    })
    .catch(error => {
      res.status(500);
      res.setHeader("Content-Type", "application/json");
      res.json({error: {message: error.message || error}});
      console.error(error.stack || error);
    })
    .finally(() => res.end());
});

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
