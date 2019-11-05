// tslint:disable-next-line: no-var-requires
const app = require("./lib/server");

app.listen(process.env.PORT || 8080, () => {
  // tslint:disable-next-line: no-expression-statement
  process.stdout.write("Server Started");
});
