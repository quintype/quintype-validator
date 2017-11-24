const compression = require('compression');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const amphtmlValidator = require('amphtml-validator');
const Promise = require("bluebird");
const rp = require('request-promise');

app.use(compression());
app.use(bodyParser.json());

const ampErrorToMessage = ({line, col, message, specUrl}) => `line ${line}, col ${col}: ${message} ${specUrl ? `(see ${specUrl})` : ""}`

function runAmpValidator(ampUrl) {
  return Promise.all([rp(ampUrl), amphtmlValidator.getInstance()])
    .then(([htmlString, validator]) => {
      const result = validator.validateString(htmlString);
      return {
        status: result.status,
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
  runAmpValidator(req.body.url)
    .then((result) => {
      res.status(201);
      res.setHeader("Content-Type", "application/json");
      res.json(result);
    });
});

module.exports = function startApp() {
  return Promise.resolve(
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
    })
  );
}
