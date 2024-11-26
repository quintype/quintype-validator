import fs from 'fs';
import { IncomingHttpHeaders } from 'http';
import yaml from 'js-yaml';
import { RequestResponse } from 'request';

interface HTTPConditions {
  readonly message?: string;
  readonly presence?: boolean;
  readonly absence?: boolean;
  readonly regex?: RegExp;
  readonly count?: number;
  readonly different_from: any;
  readonly length_le?: number;
  readonly value?: string;
  readonly presence_if_node_exists?: boolean;
}

interface BaseHTTPRule {
  readonly errors?: HTTPConditions;
  readonly warnings?: HTTPConditions;
}

interface HeaderRule extends BaseHTTPRule {
  readonly type: 'header';
  readonly header: string;
}

interface DomRule extends BaseHTTPRule {
  readonly type: 'dom';
  readonly selector: string;
  readonly contentAttr: string;
}

interface UrlRule extends BaseHTTPRule {
  readonly type: 'url';
}

interface UnknownRule extends BaseHTTPRule {
  readonly type: string;
}

type HTTPValidatiorRule = HeaderRule | DomRule | UrlRule | UnknownRule;

interface HTTPValidationConfig {
  readonly [key: string]: {
    readonly rules: ReadonlyArray<HTTPValidatiorRule>;
  };
}

interface OutputLists {
  // tslint:disable-next-line: readonly-array
  readonly errors: string[];
  // tslint:disable-next-line: readonly-array
  readonly warnings: string[];
  readonly debug: {
    // tslint:disable-next-line: readonly-keyword
    [key: string]: any;
  };
}

const config = yaml.load((fs.readFileSync(
  'config/rules.yml'
) as unknown) as string) as HTTPValidationConfig;

function validateHeader(
  headers: IncomingHttpHeaders,
  { header, errors, warnings }: HeaderRule,
  _: string,
  outputLists: OutputLists
): void {
  const value = headers[header.toLowerCase()];
  if (value) {
    // tslint:disable-next-line: no-object-mutation
    outputLists.debug[header] = value;
  }
  [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(
    pair => {
      // tslint:disable-next-line: readonly-array
      const [condition, outputList] = pair as [HTTPConditions, string[]];
      if (!condition) {
        return;
      }
      if (condition.presence && (!value || value === '')) {
        outputList.push(`Could not find header ${header}`);
        return;
      }
      if (condition.absence && value) {
        outputList.push(`Found header that should be absent ${header}`);
        return;
      }
      if (condition.regex && !(value as string).match(condition.regex)) {
        outputList.push(
          `Expected header ${header} to match ${condition.regex} (got ${value})`
        );
        return;
      }
    }
  );
}

function getContent(
  $: CheerioSelector,
  element: CheerioElement,
  contentAttr: string
): string {
  return (
    (contentAttr === 'body'
      ? $(element).html()
      : $(element).attr(contentAttr)) || ''
  );
}

function validateDom(
  $: CheerioSelector,
  { selector, contentAttr, errors, warnings }: DomRule,
  url: string,
  outputLists: OutputLists
): void {
  const elements = $(selector);
  [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(
    pair => {
      // tslint:disable-next-line: readonly-array
      const [condition, outputList] = pair as [HTTPConditions, string[]];
      if (!condition) {
        return;
      }
      if (condition.presence && elements.length === 0) {
        outputList.push(`Could not find an element with selector ${selector}`);
        return;
      }
      if (condition.count != null && elements.length !== condition.count) {
        outputList.push(
          `Expected to find ${condition.count} elements with selector ${selector}, got ${elements.length}`
        );
        return;
      }
      const elementMatched = (_: any, element: CheerioElement) => {
        const content = getContent($, element, contentAttr);
        if (condition.regex && content.match(condition.regex)) {
          return true;
        }
        return false;
      };
      if (
        condition.regex &&
        condition.presence &&
        elements.filter(elementMatched).length === 0
      ) {
        outputList.push(
          condition.message ||
            `Could not find an element with selector ${selector}`
        );
        return;
      }
      elements.each((_, element) => {
        const content = getContent($, element, contentAttr);
        // Reuse this?
        if (
          (condition.presence || condition.presence_if_node_exists) &&
          (!content || content === '')
        ) {
          outputList.push(
            `Found an empty ${selector} (attribute ${contentAttr})`
          );
          return;
        }
        if (condition.length_le && content.length > condition.length_le) {
          outputList.push(
            `Content in ${selector} is longer than ${condition.length_le}`
          );
          return;
        }
        if (condition.value == 'url' && content !== url) {
          outputList.push(
            `Content in ${selector} should have value ${url} (got ${content})`
          );
          return;
        }

        if (condition.different_from) {
          const otherElements = $(condition.different_from.selector);
          otherElements.each((_, otherElement) => {
            const otherContent = getContent(
              $,
              otherElement,
              condition.different_from.contentAttr
            );
            if (content === otherContent) {
              outputList.push(
                `Content in ${selector} should not have the same value as ${condition.different_from.selector}`
              );
            }
          });
        }
      });
    }
  );
}
function validateUrl(
  url: string,
  rule: UrlRule,
  outputLists: OutputLists
): void {
  const { errors, warnings } = rule;
  [[errors, outputLists.errors], [warnings, outputLists.warnings]].forEach(
    pair => {
      const [condition, outputList] = pair as [HTTPConditions, string[]];
      if (!condition) {
        return;
      }
      if (condition.regex && !url.match(condition.regex)) {
        outputList.push(`Expected url ${url} to match ${condition.regex}`);
      }
    }
  );
}

async function runValidator(
  category: string,
  dom: CheerioSelector,
  url: string,
  response: RequestResponse
): Promise<ValidationResult> {
  const outputLists: OutputLists = {
    errors: [],
    warnings: [],
    debug: {}
  };

  const rules = config[category].rules;
  rules.forEach(rule => {
    switch (rule.type) {
      case 'header':
        return validateHeader(
          response.headers,
          rule as HeaderRule,
          url,
          outputLists
        );
      case 'dom':
        return validateDom(dom, rule as DomRule, url, outputLists);
      case 'url':
        return validateUrl(url, rule as UrlRule, outputLists);
      default:
        throw new Error(`Unknown rule type: ${rule.type}`);
    }
  });
  return {
    status: outputLists.errors.length === 0 ? 'PASS' : 'FAIL',
    ...outputLists
  };
}

export function runSeoValidator(
  dom: CheerioSelector,
  url: string,
  response: RequestResponse
): Promise<ValidationResult> {
  return runValidator('seo', dom, url, response);
}

export function runHeaderValidator(
  dom: CheerioSelector,
  url: string,
  response: RequestResponse
): Promise<ValidationResult> {
  return runValidator('headers', dom, url, response);
}

export function runOgTagValidator(
  dom: CheerioSelector,
  url: string,
  response: RequestResponse
): Promise<ValidationResult> {
  return runValidator('og', dom, url, response);
}

export function runAssetsValidator(
  dom: CheerioSelector,
  url: string,
  response: RequestResponse
): Promise<ValidationResult> {
  return runValidator('assets', dom, url, response);
}
