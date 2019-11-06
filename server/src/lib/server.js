const { runStructuredDataValidator } = require("./runners/structuredErrorToMessage");

const { runAmpValidator } = require("./runners/runAmpValidator");

const compression = require('compression');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const Promise = require("bluebird");
const rp = require('request-promise');
const cheerio = require("cheerio");
const URL = require("url");
const _ = require("lodash");
const fs = require("fs");
const cors = require('cors');

const config = require("js-yaml").load(fs.readFileSync("config/rules.yml"));
const { runRobotsValidator, checkRobots } = require("./robots");
const getStorySeo = require("./story/seo");

app.use(compression());
app.use(bodyParser.json({ limit: "1mb" }));

app.set("view engine", "ejs");
app.use(express.static("public", { maxage: 86400000 }));

function validateHeader(headers, { header, errors, warnings }, url, outputLists) {
  const value = headers[header.toLowerCase()];

  if (value) {
    outputLists.debug[header] = value;
  }

  [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(([rules, outputList]) => {
    if (!rules)
      return;

    if (rules.presence && (!value || value == ''))
      return outputList.push(`Could not find header ${header}`);

    if (rules.absence && value)
      return outputList.push(`Found header that should be absent ${header}`)

    if (rules.regex && !value.match(rules.regex))
      return outputList.push(`Expected header ${header} to match ${rules.regex} (got ${value})`)
  })
}

function getContent($, element, contentAttr) {
  return (contentAttr == 'body' ? $(element).html() : $(element).attr(contentAttr)) || '';
}

function validateDom($, { selector, contentAttr, errors, warnings }, url, outputLists) {
  const elements = $(selector);

  [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(([rules, outputList]) => {
    if (!rules)
      return;

    if (rules.presence && elements.length == 0)
      return outputList.push(`Could not find an element with selector ${selector}`);

    if (rules.count != null && elements.length != rules.count)
      return outputList.push(`Expected to find ${rules.count} elements with selector ${selector}, got ${elements.length}`);

    elements.each((i, element) => {
      const content = getContent($, element, contentAttr);

      // Reuse this?
      if ((rules.presence || rules.presence_if_node_exists) && (!content || content == ''))
        return outputList.push(`Found an empty ${selector} (attribute ${contentAttr})`)

      if (rules.length_le && content.length > rules.length_le)
        return outputList.push(`Content in ${selector} is longer than ${rules.length_le}`);

      if (rules.value == 'url' && content != url) {
        return outputList.push(`Content in ${selector} should have value ${url} (got ${content})`);
      }

      if (rules.different_from) {
        const otherElements = $(rules.different_from.selector);
        otherElements.each((i, otherElement) => {
          const otherContent = getContent($, otherElement, rules.different_from.contentAttr);
          if (content == otherContent)
            return outputList.push(`Content in ${selector} should not have the same value as ${rules.different_from.selector}`);
        });
      }
    });
  });
}

function validateUrl(url, { errors, warnings }, _unused_, outputLists) {
  [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(([rules, outputList]) => {
    if (!rules)
      return;

    if (rules.regex && !url.match(rules.regex))
      return outputList.push(`Expected url ${url} to match ${rules.regex}`)
  })
}

function runValidator(category, dom, url, response) {
  var errors = [];
  var warnings = [];
  const debug = {};
  const rules = config[category].rules;

  rules.forEach(rule => {
    switch (rule.type) {
      case 'header': return validateHeader(response.headers, rule, url, { errors, warnings, debug });
      case 'dom': return validateDom(dom, rule, url, { errors, warnings, debug });
      case 'url': return validateUrl(url, rule, url, { errors, warnings, debug });
      default: throw `Unknown rule type: ${rule.type}`;
    }
  });

  return { status: errors.length == 0 ? "PASS" : "FAIL", errors, warnings, debug };
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

function fetchLinks($, url) {
  const links = $('a[href]').map((index, element) => URL.resolve(url, $(element).attr("href"))).get();
  return _(links).filter(link => link.startsWith("http")).uniq().value();
}

const RUNNERS = [runAmpValidator, runStructuredDataValidator, runSeoValidator, runOgTagValidator, runHeaderValidator, runRobotsValidator];

const corsMiddleware = cors({
  methods: "POST",
  origin: function (origin, callback) {
    if (origin.endsWith("quintype.com") ||
       (process.env.NODE_ENV !== 'production' && origin.startsWith("http://localhost:"))) {
      callback(null, origin)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
});
app.options("/api/validate.json", corsMiddleware);
app.post("/api/validate.json", corsMiddleware, (req, res) => {
  const url = req.body.url;
  rp(url, {
    headers: { "Fastly-Debug": "1", "QT-Debug": "1" },
    resolveWithFullResponse: true,
    gzip: true
  })
    .then(response => ({ response: response, dom: cheerio.load(response.body) }))
    .then(({ response, dom }) => Promise.all([...RUNNERS, fetchLinks].map(runner => runner(dom, url, response))))
    .then(([amp, structured, seo, og, headers, robots, links]) => {
      res.status(201);
      res.setHeader("Content-Type", "application/json");
      res.json({
        url: url,
        results: { seo, amp, og, headers, robots, structured },
        links: links
      });
    })
    .catch(error => {
      res.status(500);
      res.setHeader("Content-Type", "application/json");
      res.json({ error: { message: error.message || error } });
      console.error(error.stack || error);
    })
    .finally(() => res.end());
});

app.options("/api/seo-scores", corsMiddleware);
app.post("/api/seo-scores", corsMiddleware, (req, res) => {
  const story = req.body.story;
  const focusKeyword = req.body["focus-keyword"];
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  const seoScore = getStorySeo(story, focusKeyword);
  res.json(seoScore);
});


app.get("/validate-robots", (req, res) => {
  const { allowed = "", disallowed = "" } = req.query;
  checkRobots(allowed.split(" "), disallowed.split(" ")).then(results => {
    if (results.find(result => result.status != "PASS")) {
      res.status(418)
    }
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public,max-age=60");
    res.render("validate-robots", {
      results: results
    })
  }).catch(e => {
    console.log(e);
    res.status(500);
    res.end();
  });
});

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public,max-age=60");
  res.redirect(301, "https://developers.quintype.com/quintype-validator");
});

app.get("/ping", (req, res) => res.send("pong"));

module.exports = app;
