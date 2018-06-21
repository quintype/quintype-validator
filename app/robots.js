const URL = require("url");
const rp = require('request-promise');
const robotsParser = require('robots-parser');

const BOTS = ["GoogleBot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider"];
exports.runRobotsValidator = function runRobotsValidator(dom, url, response) {
  const robotsUrl = URL.resolve(url, "/robots.txt");
  return rp(robotsUrl, {
    resolveWithFullResponse: true,
    gzip: true,
    simple: false
  }).then(response => {
    if(response.statusCode != 200) {
      return {status: "FAIL", errors: [`Status Code Was ${response.statusCode}`], debug: {statusCode: response.statusCode}};
    } else {
      const robots = robotsParser(robotsUrl, response.body);
      const errors = BOTS.filter(bot => !robots.isAllowed(url, bot))
                         .map(bot => `${bot} was not allowed to crawl this page`);

      const sitemaps = robots.getSitemaps();
      if(sitemaps.length == 0) {
        errors.push("There was no sitemap configured");
      }

      const debug = {content: response.body, sitemaps: sitemaps.join(","), lineNo: robots.getMatchingLineNumber(url)};

      if(errors.length == 0) {
        return {status: "PASS", debug: debug};
      } else {
        return {status: "FAIL", errors: errors, debug: debug};
      }
    }
  });
}
