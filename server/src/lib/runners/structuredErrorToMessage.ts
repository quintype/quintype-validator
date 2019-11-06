import _ from "lodash";
import rp from 'request-promise';
import { ValidationResult } from "./ValidationResult";

const structuredErrorToMessage = ({ ownerSet, errorType, args, begin, end }: any) => `[${_.keys(ownerSet).join(" ")}] ${errorType} ${args.join(" ")} (${begin} - ${end})`;

interface StructuredDataAPIResponse {
  readonly errors: ReadonlyArray<{ readonly isSevere: boolean }>;
  readonly numObjects: number;
  readonly contentId: string;
  readonly url: string;
}

export function runStructuredDataValidator(_: CheerioSelector, url: string): Promise<ValidationResult> {
  return rp.post("https://search.google.com/structured-data/testing-tool/validate", {
    form: { url }
  })
    .then(body => JSON.parse(body.substring(body.indexOf("{"))))
    .then(({ errors, numObjects, contentId, url }: StructuredDataAPIResponse) => {
      const actualErrors = errors.filter(error => error.isSevere).map(structuredErrorToMessage);
      const warnings = errors.filter(error => !error.isSevere).map(structuredErrorToMessage);
      if (!contentId) {
        // tslint:disable-next-line: no-expression-statement
        warnings.push("No ContentId was found");
      }
      return {
        errors: actualErrors,
        warnings,
        numObjects,
        contentId,
        url,
        status: actualErrors.length > 0 ? "FAIL" : numObjects === 0 ? "NA" : "PASS"
      };
    }).catch(e => ({
      status: "ERROR",
      debug: { error: e.message }
    }));
}
