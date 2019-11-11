import rp from 'request-promise';
import URL from "url";

export async function runRouteDataValidator(_: CheerioSelector, url: string): Promise<ValidationResult> {
  const { pathname } = URL.parse(url);
  const routeDataPath = URL.resolve(url, `/route-data.json?path=${encodeURIComponent(pathname || "")}`);
  try {
    const data: any = await rp(routeDataPath, {
      gzip: true,
      json: true
    });

    const dataLength = JSON.stringify(data).length;

    // tslint:disable-next-line: readonly-array
    const errors: string[] = [];

    if(dataLength > 250000) {
      errors.push(`route-data.json returned a huge response (${dataLength} bytes)`)
    }

    if(data.config.sections) {
      errors.push(`route-data.json has config.sections in the response`)
    }

    return {
      status: errors.length > 0 ? "FAIL" : "PASS",
      errors,
      debug: {
        lengthBytes: dataLength
      }
    }
  } catch(e) {
    return {
      status: "NA",
      errors: [`Could not load Route Data (${routeDataPath})`]
    }
  }
}
