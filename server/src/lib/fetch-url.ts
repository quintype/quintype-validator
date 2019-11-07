import cheerio from 'cheerio';
import { RequestResponse } from "request";
import rp from 'request-promise';

export interface FetchUrlResponse {
  readonly url: string;
  readonly dom: CheerioSelector;
  readonly response: RequestResponse ;
}

export async function fetchUrl(url: string): Promise<FetchUrlResponse> {
  const response = await rp(url, {
    headers: { "Fastly-Debug": "1", "QT-Debug": "1" },
    resolveWithFullResponse: true,
    gzip: true
  }) as RequestResponse;
  const dom = cheerio.load(response.body);
  if(response.headers["set-cookie"]) {
    const nonDefaultCookies = response.headers["set-cookie"].filter(str => !str.startsWith("__cfduid="));
    // tslint:disable-next-line: no-object-mutation
    response.headers["set-cookie"] = nonDefaultCookies.length ? nonDefaultCookies : undefined;
  }

  return { dom, response, url };
}
