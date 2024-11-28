import _ from 'lodash';
import rp from 'request-promise';

const structuredErrorToMessage = ({
  ownerSet,
  errorType,
  args,
  begin,
  end
}: any) =>
  `[${_.keys(ownerSet).join(' ')}] ${errorType} ${args.join(
    ' '
  )} (${begin} - ${end})`;

interface StructuredDataAPIResponse {
  readonly errors: ReadonlyArray<{ readonly isSevere: boolean }>;
  readonly numObjects: number;
  readonly contentId: string;
  readonly url: string;
}

export async function runStructuredDataValidator(
  _: CheerioSelector,
  url: string
): Promise<ValidationResult> {
  try {
    const body = await rp.post('https://validator.schema.org/validate', {
      form: { url }
    });
    const results = JSON.parse(
      body.substring(body.indexOf('{'))
    ) as StructuredDataAPIResponse;
    const { errors, numObjects, contentId } = results;
    const actualErrors = errors
      .filter(error => error.isSevere)
      .map(structuredErrorToMessage);
    const warnings = errors
      .filter(error => !error.isSevere)
      .map(structuredErrorToMessage);
    if (!contentId) {
      warnings.push('No ContentId was found');
    }
    return {
      errors: actualErrors,
      warnings,
      numObjects,
      contentId,
      url: results.url,
      status:
        actualErrors.length > 0 ? 'FAIL' : numObjects === 0 ? 'NA' : 'PASS'
    };
  } catch (e) {
    return {
      status: 'ERROR',
      debug: { error: e.message }
    };
  }
}
