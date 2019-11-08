import rp from 'request-promise';

export async function fetchLighthouse(url: string): Promise<any> {
  const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?category=accessibility&category=best-practices&category=performance&category=pwa&category=seo&strategy=mobile&url=${encodeURI(url)}`;
  const data = await rp(psUrl, {
    json: true,
    gzip: true
  });
  return new Lighthouse(url, data);
}

// tslint:disable: no-class no-this
class Lighthouse {
  private readonly data: any;
  private readonly url: string;

  constructor(url: string, data: any) {
    this.url = url;
    this.data = data;
  }

  public getAudit(name: string): {readonly score: number, readonly errors: ReadonlyArray<string>} {
    const category = this.data.lighthouseResult.categories[name];
    return {
      score: category.score * 100,
      errors: category.auditRefs
        .filter(({weight}: any) => weight > 0)
        .map(({ id }: any) => this.data.lighthouseResult.audits[id])
        .filter(({ score }: any) => score < 1)
        // tslint:disable-next-line: readonly-keyword
        .map(({ score, displayValue, title }: any) => `(${score * 100}%) - ${title} (${this.url} ${displayValue || ""})`)
    }
  }

  public getAuditScore(name: string): number {
    return this.data.lighthouseResult.audits[name].numericValue;
  }
}
