const express = require('express');
const path = require('path');
const app = express();
const { PingHandler } = require("./test");

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', PingHandler);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
