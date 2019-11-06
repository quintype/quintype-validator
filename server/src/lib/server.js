const { validateRobotsHandler } = require("./handlers/validate-robots-handler");

const { seoScoreHandler } = require("./handlers/seo-score-handler");

const { validateUrlHandler } = require("./handlers/validate-url-handler");

const compression = require('compression');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require('cors');

app.use(compression());
app.use(bodyParser.json({ limit: "1mb" }));

app.set("view engine", "ejs");
app.use(express.static("public", { maxage: 86400000 }));

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
app.post("/api/validate.json", corsMiddleware, validateUrlHandler);

app.options("/api/seo-scores", corsMiddleware);
app.post("/api/seo-scores", corsMiddleware, seoScoreHandler);

app.get("/validate-robots", validateRobotsHandler);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "public,max-age=60");
  res.redirect(301, "https://developers.quintype.com/quintype-validator");
});

app.get("/ping", (req, res) => res.send("pong"));

module.exports = app;
