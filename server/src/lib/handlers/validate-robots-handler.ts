import { Request, Response } from "express";
import { checkRobots } from "../runners/robots";

export async function validateRobotsHandler(req: Request, res: Response): Promise<void> {
  const { allowed = "", disallowed = "" } = req.query;
  // tslint:disable: no-expression-statement
  try {
    const results = await checkRobots(allowed.split(" "), disallowed.split(" "))
    if (results.find(result => result.status !== "PASS")) {
      res.status(418);
    }
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public,max-age=60");
    res.render("validate-robots", {
      results
    });
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.log(e);
    res.status(500);
  } finally {
    res.end();
  };
}
