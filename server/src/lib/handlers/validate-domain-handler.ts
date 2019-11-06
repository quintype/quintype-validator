import { Request, Response } from "express";
import _ from "lodash";
import rp from "request-promise";

async function randomStories(baseUrl: string, count: number): Promise<ReadonlyArray<string>> {
  const {stories} = await rp(`${baseUrl}/api/v1/stories?fields=url`, { gzip: true, json: true});
  return stories
    .sort(() => 0.5 - Math.random())
    .map((story: { readonly url: any; }) => story.url)
    .slice(0, count);
}

async function randomSections(baseUrl: string, count: number): Promise<ReadonlyArray<string>> {
  const {sections} = await rp(`${baseUrl}/api/v1/config`, { gzip: true, json: true });
  return sections
    .sort(() => 0.5 - Math.random())
    .map((section: { readonly "section-url": string; }) => section["section-url"])
    .slice(0, count);
}

export async function validateDomainHandler(req: Request, res: Response): Promise<void> {
  try {
    const baseUrl = `https://${req.body.domain}`;
    const homePage = `${baseUrl}/`
    const [stories, sections] = await Promise.all([randomStories(baseUrl, 5), randomSections(baseUrl, 2)]);
    // tslint:disable-next-line: no-expression-statement
    res
      .status(200)
      .header("Content-Type", "application/json")
      .json({stories, sections, homePage})
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.error(error.stack || error);
    // tslint:disable-next-line: no-expression-statement
    res
      .status(500)
      .header("Content-Type", "application/json")
      .json({ error: { message: error.message || error } });
  } finally {
    // tslint:disable-next-line: no-expression-statement
    res.end()
  }
}
