const { runSeoValidator, runOgTagValidator, runHeaderValidator } = require("./runners/http");

const { runStructuredDataValidator } = require("./runners/structured-data");
const { runAmpValidator } = require("./runners/amp");
const { runRobotsValidator, checkRobots } = require("./runners/robots");

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

const getStorySeo = require("./story/seo");

app.use(compression());
app.use(bodyParser.json({ limit: "1mb" }));

app.set("view engine", "ejs");
app.use(express.static("public", { maxage: 86400000 }));

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
