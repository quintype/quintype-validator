import rp from 'request-promise';
import robotsParser from 'robots-parser';
import URL from "url";

const BOTS: ReadonlyArray<string> = ["GoogleBot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider", "YandexBot"];

export async function runRobotsValidator(_: CheerioAPI, url: string): Promise<ValidationResult> {
  const robotsUrl = URL.resolve(url, "/robots.txt");
  const response = await rp(robotsUrl, {
    resolveWithFullResponse: true,
    gzip: true,
    simple: false
  });
  if (response.statusCode !== 200) {
    return { status: "FAIL", errors: [`Status Code Was ${response.statusCode}`], debug: { statusCode: response.statusCode } };
  }
  else {
    const robots = robotsParser(robotsUrl, response.body);
    const errors = BOTS.filter(bot => !robots.isAllowed(url, bot))
      .map(bot => `${bot} was not allowed to crawl this page`);
    const sitemaps = robots.getSitemaps();
    if (sitemaps.length === 0) {
      errors.push("There was no sitemap configured");
    }
    const debug = { content: response.body, sitemaps: sitemaps.join(","), lineNo: robots.getMatchingLineNumber(url) };
    if (errors.length === 0) {
      return { status: "PASS", debug };
    }
    else {
      return { status: "FAIL", errors, debug };
    }
  }
}

async function checkUrl(url: string, allowed = true): Promise<ValidationResult> {
  const robotsUrl = URL.resolve(url, "/robots.txt");
  try {
    const response = await rp(robotsUrl, {
      resolveWithFullResponse: true,
      gzip: true,
      simple: false
    });
    if (response.statusCode !== 200) {
      return { status: "FAIL", url, debug: ["Could Not Fetch Robots"] };
    }
    const robots = robotsParser(robotsUrl, response.body);
    const firstInvalidBot = BOTS.find(bot => !robots.isAllowed(url, bot));
    return {
      status: ((allowed && !firstInvalidBot) || (!allowed && firstInvalidBot)) ? "PASS" : "FAIL",
      url,
      debug: firstInvalidBot ? `${firstInvalidBot} was not allowed to crawl this page` : "All bots were allowed to crawl"
    };
  }
  catch (e) {
    return {
      status: "ERROR",
      url,
      debug: `Something crashed. Does ${robotsUrl} load?`
    };
  }
}

export function checkRobots(allowedUrls: ReadonlyArray<string>, disallowedUrls: ReadonlyArray<string>): Promise<ReadonlyArray<ValidationResult>> {
  const allowedPromise = allowedUrls.filter(u => u != '').map(url => checkUrl(`https://${url}`));
  const disallowedPromise = disallowedUrls.filter(u => u != '').map(url => checkUrl(`https://${url}`, false));
  return Promise.all(allowedPromise.concat(disallowedPromise));
}
