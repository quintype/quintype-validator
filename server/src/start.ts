import { app } from "./lib/server";

const port = process.env.PORT || 8080;
// tslint:disable-next-line: no-expression-statement
app.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log("Server Started at", `${port}`);
});
