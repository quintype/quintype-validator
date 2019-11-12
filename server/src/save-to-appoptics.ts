import flatMap = require("array.prototype.flatmap");
import { readFileSync } from "fs";
import { load } from "js-yaml";
import rp from 'request-promise';

import { runAllChecksAgainstDomain } from "./lib/handlers/validate-domain-handler";

interface AppOpticsMetric {
  readonly name: string;
  readonly value: number;
  readonly tags: { readonly [key: string]: string }
}

// tslint:disable: no-object-mutation no-delete
async function saveToAppOptics(): Promise<void> {
  const { domains, appoptics_token } = load(readFileSync("config/domains.yml") as unknown as string);
  for(const x of domains) {
    try {
      await runChecksAndPostToAppOptics(x, appoptics_token);
    } catch(e) {
      // tslint:disable-next-line: no-console
      console.error(`Could Not Save Domain ${x.domain}`)
      // tslint:disable-next-line: no-console
      console.error(e.stack || e);
    }
  }
}

async function runChecksAndPostToAppOptics({ domain, skipPwa, skipRouteData }: any, appoptics_token: string): Promise<void> {
  // tslint:disable-next-line: no-console
  console.log(`Starting To Process ${domain}`);
  const auditResults = await runAllChecksAgainstDomain(domain);
  if (skipPwa) {
    delete auditResults.results.lighthousePwa;
  }
  if (skipRouteData) {
    delete auditResults.results.routeData;
  }
  const measurements: ReadonlyArray<AppOpticsMetric> = [
    ...lightHouseMetrics(domain, auditResults.results.pagespeed),
    ...routeDataMetrics(domain, auditResults.results.routeData),
  ];
  // tslint:disable-next-line: no-console
  console.log(`Posting ${measurements.length} metrics for ${domain}: ${JSON.stringify(measurements)}`);
  await rp({
    method: 'POST',
    uri: "https://api.appoptics.com/v1/measurements",
    body: {
      measurements
    },
    auth: {
      user: appoptics_token,
      pass: ''
    },
    json: true
  });
}

function lightHouseMetrics(domain: string, auditResults: ValidationResult): readonly AppOpticsMetric[] {
  const metrics: readonly string[] = ['fcp', 'fmp', 'tti', 'mfid', 'si', 'ttfb']

  if (!auditResults || !auditResults.debug) {
    return []
  }

  return flatMap(metrics, metric => [[metric, 'home'], [metric, 'story']])
    .filter(([metric, page]) => (auditResults.debug || {})[`${page}-${metric}`])
    .map(([metric, page]) => ({
      name: `frontend.metrics.${metric}`,
      value: (auditResults.debug || {})[`${page}-${metric}`] as number,
      tags: {
        domain,
        page
      }
    }))
}

function routeDataMetrics(domain: string, auditResults: ValidationResult): readonly AppOpticsMetric[] {
  if (!auditResults || !auditResults.debug) {
    return []
  }

  return ['home', 'story'].map(page => ({
    name: `frontend.metrics.route-data-length`,
    value: (auditResults.debug || {})[`${page}-bytes`] as number,
    tags: {
      domain,
      page
    }
  }))
}

saveToAppOptics();
