import amphtmlValidator from 'amphtml-validator';
import rp from 'request-promise';
import URL from 'url';
import { ValidationResult } from './ValidationResult';

const ampErrorToMessage = ({ line, col, message, specUrl }: any) => `line ${line}, col ${col}: ${message} ${specUrl ? `(see ${specUrl})` : ""}`;

function getAmpUrlFromPage(url: string, dom: CheerioSelector): string | null {
  const ampUrl = dom('link[rel=amphtml]').attr('href');

  if (!ampUrl || ampUrl === '') {
    return null;
  }

  if (ampUrl.startsWith('/')) {
    return URL.resolve(url, ampUrl);
  }

  return ampUrl;
}

export function runAmpValidator(dom: CheerioSelector, url: string): Promise<ValidationResult> {
  const ampUrl = getAmpUrlFromPage(url, dom);

  if (!ampUrl) {
    return Promise.resolve({
      status: "NA",
      ampUrl: null,
      errors: ["No AMP Page Found"]
    });
  };

  return Promise.all([rp(ampUrl), amphtmlValidator.getInstance()])
    .then(([htmlString, validator]) => {
      const result = validator.validateString(htmlString);
      return {
        ampUrl,
        status: result.status,
        errors: result.errors.filter(({ severity }) => severity === "ERROR").map(ampErrorToMessage),
        warnings: result.errors.filter(({ severity }) => severity !== "ERROR").map(ampErrorToMessage),
        debug: { "Amp Url": ampUrl }
      };
    });
}
