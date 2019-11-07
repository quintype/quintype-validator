import flatMap from 'array.prototype.flatmap';
import { Request, Response } from "express";
import _ from "lodash";
import rp from "request-promise";

import { fetchUrl, FetchUrlResponse } from "../fetch-url";
import { runAmpValidator } from '../runners/amp';
import { runHeaderValidator, runOgTagValidator, runSeoValidator } from "../runners/http";
import { checkUrls } from "../runners/robots";

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

export async function validateDomainHandler(req: Request, res: Response): Promise<void> {
  try {
    const baseUrl = `https://${req.body.url}`;
    const [homePage, stories, sections] = await Promise.all([fetchUrl(`${baseUrl}/`), randomStories(baseUrl, 5), randomSections(baseUrl, 2)]);

    const allPages = [homePage, ...stories, ...sections] as ReadonlyArray<FetchUrlResponse>;

    const [robots, {seo, og, headers}, amp] = await Promise.all([
      checkUrls(allPages.map(i => i.url)),
      checkHTTPResponses(allPages),
      checkAmp(stories)
    ])

    res
      .status(200)
      .header("Content-Type", "application/json")
      .json({
        url: `${req.body.url}`,
        results: {robots, seo, og, headers, amp},
        links: allPages.map(p => p.url)
      })
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
