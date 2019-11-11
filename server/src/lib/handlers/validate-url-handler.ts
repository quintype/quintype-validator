import { Request, Response } from "express";
import _ from "lodash";
import URL from "url";

import { fetchUrl } from '../fetch-url';
import { runAmpValidator } from "../runners/amp";
import { runHeaderValidator, runOgTagValidator, runSeoValidator } from "../runners/http";
import { runRobotsValidator } from "../runners/robots";
import { runRouteDataValidator } from "../runners/route-data";
import { runStructuredDataValidator } from "../runners/structured-data";

function fetchLinks($: CheerioSelector, url: string): ReadonlyArray<string> {
  const links = $('a[href]').map((_, element) => URL.resolve(url, $(element).attr("href"))).get();
  return _(links).filter(link => link.startsWith("http")).uniq().value();
}
const RUNNERS: ReadonlyArray<any> = [runAmpValidator, runStructuredDataValidator, runSeoValidator, runOgTagValidator, runHeaderValidator, runRobotsValidator, runRouteDataValidator];

export async function validateUrlHandler(req: Request, res: Response): Promise<void> {
  try {
    const url = req.body.url;
    const { dom, response } = await fetchUrl(url);
    const [links, amp, structured, seo, og, headers, robots, routeData] = await Promise.all([fetchLinks, ...RUNNERS].map(runner => runner(dom, url, response)));

    res.status(201);
    res.setHeader("Content-Type", "application/json");
    res.json({
      url,
      results: { seo, amp, og, headers, robots, routeData, structured },
      links
    });
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.error(error.stack || error);
    res.status(500);
    res.setHeader("Content-Type", "application/json");
    res.json({ error: { message: error.message || error } });
  } finally {
    res.end()
  }
}
