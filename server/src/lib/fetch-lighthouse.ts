import rp from 'request-promise';

export const INVALID_LIGHTHOUSE_SCORE = -1;

interface LighthouseResults {
  readonly getAudit: (
    name: string
  ) => { readonly score: number; readonly errors: ReadonlyArray<string> };
  readonly getDebuggingInfo: (
    prefix: string
  ) => { readonly [key: string]: number };
}

export async function fetchLighthouse(url: string): Promise<LighthouseResults> {
  const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?category=accessibility&category=best-practices&category=performance&category=seo&strategy=mobile&url=${encodeURI(
    url
  )}`;
  try {
    const data = await rp(psUrl, {
      json: true,
      gzip: true
    });
    return new Lighthouse(url, data);
  } catch (e) {
    console.error(e.message || e);
    return new LighthouseError(url);
  }
}

// tslint:disable-next-line:no-class
class Lighthouse implements LighthouseResults {
  private readonly data: any;
  private readonly url: string;

  constructor(url: string, data: any) {
    this.url = url;
    this.data = data;
  }

  public getAudit(
    name: string
  ): { readonly score: number; readonly errors: ReadonlyArray<string> } {
    const category = this.data.lighthouseResult.categories[name];
    return {
      score: category.score * 100,
      errors: category.auditRefs
        .filter(({ weight }: any) => weight > 0)
        .map(({ id }: any) => this.data.lighthouseResult.audits[id])
        .filter(({ score }: any) => score < 1)
        // tslint:disable-next-line: readonly-keyword
        .map(
          ({ score, displayValue, title }: any) =>
            `(${score * 100}%) - ${title} (${this.url} ${displayValue || ''})`
        )
    };
  }

  public getDebuggingInfo(prefix: string): { readonly [key: string]: number } {
    return {
      [`${prefix}-fcp`]: this.getAuditScore('first-contentful-paint'),
      [`${prefix}-fmp`]: this.getAuditScore('first-meaningful-paint'),
      [`${prefix}-tti`]: this.getAuditScore('interactive'),
      [`${prefix}-mfid`]: this.getAuditScore('max-potential-fid'),
      [`${prefix}-si`]: this.getAuditScore('speed-index'),
      [`${prefix}-ttfb`]: this.getAuditScore('server-response-time')
    };
  }

  private getAuditScore(name: string): number {
    return this.data.lighthouseResult.audits[name].numericValue;
  }
}

// tslint:disable-next-line: max-classes-per-file
class LighthouseError implements LighthouseResults {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  public getAudit(
    _: string
  ): { readonly score: number; readonly errors: ReadonlyArray<string> } {
    return {
      score: INVALID_LIGHTHOUSE_SCORE,
      errors: [`PageSpeed Crashed While Querying ${this.url}`]
    };
  }

  public getDebuggingInfo(_: string): { readonly [key: string]: number } {
    return {};
  }
}
