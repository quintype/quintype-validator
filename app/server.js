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

  return Promise.all([rp(ampUrl), amphtmlValidator.getInstance()])
    .then(([htmlString, validator]) => {
      const result = validator.validateString(htmlString);
      return {
        status: result.status,
        ampUrl: ampUrl,
        errors: result.errors
                      .filter(({severity}) => severity == "ERROR")
                      .map(ampErrorToMessage),
        warnings: result.errors
                        .filter(({severity}) => severity != "ERROR")
                        .map(ampErrorToMessage)
      }
    });
}

app.post("/validate.json", (req, res) => {
  const url = req.body.url;
  rp(url)
    .then(htmlString => cheerio.load(htmlString))
    .then(dom => runAmpValidator(url, dom))
    .then((result) => {
      res.status(201);
      res.setHeader("Content-Type", "application/json");
      res.json(result);
    })
    .catch(error => {
      res.status(500);
      res.send(error.message);
      console.error(error.stack);
    })
    .finally(() => res.end());
});

module.exports = function startApp() {
  return Promise.resolve(
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
    })
  );
}
