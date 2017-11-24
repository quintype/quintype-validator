var cluster = require('cluster');
var process = require("process");

if(cluster.isMaster) {
  var os = require('os');
  for (var i = 0; i < 4; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    cluster.fork();
  });
} else {
  const app = require("./app/server.js");
  try {
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!');
    });
  } catch (e) {
    var sleep = require("sleep-promise");
    console.error("Worker died - Aborting");
    console.error(e.stack);
    cluster.worker.disconnect();
    sleep(250).then(() => process.exit());
  }
}
