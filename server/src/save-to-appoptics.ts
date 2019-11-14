import flatMap = require("array.prototype.flatmap");
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { createTransport } from 'nodemailer';
import rp from 'request-promise';

// tslint:disable-next-line: no-submodule-imports
import Mail from "nodemailer/lib/mailer";
import { runAllChecksAgainstDomain } from "./lib/handlers/validate-domain-handler";

const SEND_EMAILS_BEFORE_HOUR = 2;

interface AppOpticsMetric {
  readonly name: string;
  readonly value: number;
  readonly tags: { readonly [key: string]: string }
}

// tslint:disable: no-object-mutation no-delete
async function saveToAppOptics(appoptics_token?: string, gmail_user?: string, gmail_password?: string): Promise<void> {
  const { domains } = load(readFileSync("config/domains.yml") as unknown as string);
  const emailTransport = createTransport({
    service: 'gmail',
    auth: { user: gmail_user, pass: gmail_password }
  })
  for(const x of domains) {
    try {
      await runChecksAndPostToAppOptics(x, appoptics_token, emailTransport);
    } catch(e) {
      // tslint:disable-next-line: no-console
      console.error(`Could Not Save Domain ${x.domain}`)
      // tslint:disable-next-line: no-console
      console.error(e.stack || e);
    }
  }
}

async function runChecksAndPostToAppOptics({ domain, skipPwa, skipRouteData, email }: any, appoptics_token: string | undefined, mailer: Mail): Promise<void> {
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

  // Tejas: The next line is typescript for typescripts sake :-)
  const mandatoryToPass: ReadonlyArray<"amp" | "robots" | "seo" | "headers" | "og"> = ["amp", "robots", "seo", "headers", "og"];
  if(!mandatoryToPass.every(test => auditResults.results[test].status === "PASS")) {
    // Tejas: putting this ugly hack to ensure emails are only sent out once a day
    if(email && new Date().getHours() < SEND_EMAILS_BEFORE_HOUR) {
      // tslint:disable-next-line: no-console
      console.log("Sending Email");
      mailer.sendMail({
        to: email,
        subject: `[Validator] The domain ${domain} failed some validation tests`,
        html: `
The Quintype Validator found some issues with your domain ${domain}.<br/>
<table>
  <tr><th>Test</th><th>Status</th></tr>
  ${mandatoryToPass.map(test => `<tr><td>${test}</td><td>${auditResults.results[test].status}</td></tr>`).join("")}
</table>
Please drop the attached json file into <a href="https://developers.quintype.com/quintype-validator">https://developers.quintype.com/quintype-validator</a> for more details.<br/>
`,
        text: `Please drop the attached json file into https://developers.quintype.com/quintype-validator for more details.`,
        attachments: [
          {filename: "validator-results.json", content: JSON.stringify(auditResults)}
        ]
      })
    }
  }
}

function lightHouseMetrics(domain: string, auditResults: ValidationResult): readonly AppOpticsMetric[] {
  const metrics: readonly string[] = ['fcp', 'fmp', 'tti', 'mfid', 'si', 'ttfb', 'pagespeed', 'fci']

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

saveToAppOptics(process.env.APPOPTICS_TOKEN, process.env.GMAIL_USER, process.env.GMAIL_PASSWORD);
