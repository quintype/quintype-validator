import flatMap from 'array.prototype.flatmap';
import { Request, Response } from "express";
import _ from "lodash";
import rp from "request-promise";

import { fetchLighthouse } from '../fetch-lighthouse';
import { fetchUrl, FetchUrlResponse } from "../fetch-url";
import { runAmpValidator } from '../runners/amp';
import { runHeaderValidator, runOgTagValidator, runSeoValidator } from "../runners/http";
import { checkUrls } from "../runners/robots";
import { runRouteDataValidator } from '../runners/route-data';

async function randomStories(baseUrl: string, count: number): Promise<ReadonlyArray<FetchUrlResponse>> {
  const {stories} = await rp(`${baseUrl}/api/v1/stories?fields=url`, { gzip: true, json: true});
  return Promise.all(
    stories
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map((story: { readonly url: any; }) => fetchUrl(story.url))
  );
}

async function randomSections(baseUrl: string, count: number): Promise<ReadonlyArray<FetchUrlResponse>> {
  const {sections} = await rp(`${baseUrl}/api/v1/config`, { gzip: true, json: true });
  return Promise.all(
    sections
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map((section: { readonly "section-url": string; }) => fetchUrl(section["section-url"]))
  );
}

async function checkHTTPResponses(pages: ReadonlyArray<FetchUrlResponse>): Promise<{readonly og: any, readonly seo: any, readonly headers: any}> {
  const responses = await Promise.all(
    pages.map(async ({url, dom, response}) => ({
      url,
      seo: await runSeoValidator(dom, url, response),
      og: await runOgTagValidator(dom, url, response),
      headers: await runHeaderValidator(dom, url, response)
    }))
  );

  return {
    og: combineResults('og'),
    seo: combineResults('seo'),
    headers: combineResults('headers')
  }

  function combineResults(key: 'og' | 'seo' | 'headers'): ValidationResult {
    // tslint:disable-next-line: readonly-array
    const errors = flatMap(responses, r => (r[key].errors as string[] || []).map(e => `${r.url}: ${e}`));
    return errors.length
      ? { status: "FAIL", errors }
      : { status: "PASS" };
  }
}

async function checkAmp(stories: readonly FetchUrlResponse[]): Promise<ValidationResult> {
  const ampResults = await Promise.all(stories.map(async ({dom, url}) => ({url, result: await runAmpValidator(dom, url)})));
  const failingAmpPages = ampResults.filter(({result}) => result.status !== "PASS");
  const percentage = (failingAmpPages.length * 100 / stories.length);
  return {
    status: percentage > 40 ? 'FAIL' : 'PASS',
    errors: flatMap(failingAmpPages, ({result, url}) => (result.errors || []).map(e => `${url}: ${e}`)),
    debug: [`${100 - percentage}% of tested story pages had AMP versions`]
  }
}

async function checkLighthouseResults(homePage: FetchUrlResponse, story: FetchUrlResponse): Promise<{
  readonly pagespeed: ValidationResult,
  readonly lighthouseSeo?: ValidationResult,
  readonly lighthousePwa?: ValidationResult
}> {
  const [homeAudit, storyAudit] = await Promise.all([fetchLighthouse(homePage.url), fetchLighthouse(story.url)]);

  const combineAudits = (category: string, minScore: number) => {
    const homeResult = homeAudit.getAudit(category);
    const storyResult = storyAudit.getAudit(category);

    const errors: ReadonlyArray<string> = [...homeResult.errors, ...storyResult.errors];

    return {
      status: homeResult.score >= minScore && storyResult.score >= minScore ? "PASS" : "FAIL",
      errors: [...(errors.length > 0 ? [`Scores - Home ${homeResult.score}%, Story ${storyResult.score}%`] : []), ...errors]
    }
  }

  return {
    lighthousePwa: combineAudits('pwa', 50),
    lighthouseSeo: combineAudits('seo', 95),
    pagespeed: {
      ...combineAudits('performance', 75),
      debug: {
        ...homeAudit.getDebuggingInfo("home"),
        ...storyAudit.getDebuggingInfo("story")
      }
    },
  }
}

async function checkRouteData(homePage: FetchUrlResponse, story: FetchUrlResponse): Promise<ValidationResult> {
  const [homePageAudit, storyPageAudit] = await Promise.all([
    runRouteDataValidator(homePage.dom, homePage.url),
    runRouteDataValidator(story.dom, story.url)
  ]);
  return {
    status: homePageAudit.status,
    errors: [
      ...(homePageAudit.errors || []).map((s: string) => `${s} (${homePage.url})`),
      ...(storyPageAudit.errors || []).map((s: string) => `${s} (${story.url})`),
    ],
    debug: {
      "home-bytes": homePageAudit.debug && (homePageAudit.debug as any).lengthBytes,
      "story-bytes": storyPageAudit.debug && (storyPageAudit.debug as any).lengthBytes,
    }
  }
}

export async function validateDomainHandler(req: Request, res: Response): Promise<void> {
  try {
    const domain = req.body.url;
    const response = await runAllChecksAgainstDomain(domain);

    res
      .status(200)
      .header("Content-Type", "application/json")
      .json(response)
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.error(error.stack || error);

    res
      .status(500)
      .header("Content-Type", "application/json")
      .json({ error: { message: error.message || error } });
  } finally {
    res.end()
  }
}
// tslint:disable-next-line: typedef
export async function runAllChecksAgainstDomain(domain: string) {
  const baseUrl = `https://${domain}`;
  const [homePage, stories, sections] = await Promise.all([fetchUrl(`${baseUrl}/`), randomStories(baseUrl, 5), randomSections(baseUrl, 2)]);
  const allPages = [homePage, ...stories, ...sections] as ReadonlyArray<FetchUrlResponse>;

  const [robots, { seo, og, headers }, amp, { lighthouseSeo, lighthousePwa, pagespeed }, routeData] = await Promise.all([
    checkUrls(allPages.map(i => i.url)),
    checkHTTPResponses(allPages),
    checkAmp(stories),
    checkLighthouseResults(homePage, stories[0]),
    checkRouteData(homePage, stories[0])
  ]);

  return {
    url: domain,
    results: { robots, seo, og, headers, amp, pagespeed, lighthouseSeo, lighthousePwa, routeData },
    links: allPages.map(p => p.url)
  };
}

