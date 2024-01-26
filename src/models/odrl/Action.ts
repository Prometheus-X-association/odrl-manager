import { EntityRegistry } from 'EntityRegistry';
import { ModelBasic } from '../ModelBasic';
import { Constraint } from './Constraint';
import { RuleDuty } from './RuleDuty';

export const actions = [
  'Attribution',
  'CommericalUse',
  'DerivativeWorks',
  'Distribution',
  'Notice',
  'Reproduction',
  'ShareAlike',
  'Sharing',
  'SourceCode',
  'acceptTracking',
  'adHocShare',
  'aggregate',
  'annotate',
  'anonymize',
  'append',
  'appendTo',
  'archive',
  'attachPolicy',
  'attachSource',
  'attribute',
  'commercialize',
  'compensate',
  'concurrentUse',
  'copy',
  'delete',
  'derive',
  'digitize',
  'display',
  'distribute',
  'ensureExclusivity',
  'execute',
  'export',
  'extract',
  'extractChar',
  'extractPage',
  'extractWord',
  'give',
  'grantUse',
  'include',
  'index',
  'inform',
  'install',
  'lease',
  'lend',
  'license',
  'modify',
  'move',
  'nextPolicy',
  'obtainConsent',
  'pay',
  'play',
  'present',
  'preview',
  'print',
  'read',
  'reproduce',
  'reviewPolicy',
  'secondaryUse',
  'sell',
  'share',
  'shareAlike',
  'stream',
  'synchronize',
  'textToSpeech',
  'transfer',
  'transform',
  'translate',
  'uninstall',
  'use',
  'watermark',
  'write',
  'writeTo',
] as const;

export type ActionType = (typeof actions)[number];

type InclusionMap = Map<string, Set<string>>;

export class Action extends ModelBasic {
  private static inclusions: InclusionMap = new Map();

  value: string;
  refinement?: Constraint[];
  includedIn: Action | null;
  implies?: Action[];

  constructor(value: string, includedIn: Action | null) {
    super();
    this.value = value;
    this.includedIn = includedIn;

    Action.includeIn(value, [this.value]);
  }

  public static includeIn(current: string, values: string[]) {
    let inclusions: Set<string> | undefined = Action.inclusions.get(current);
    if (!inclusions) {
      inclusions = new Set<string>();
      Action.inclusions.set(current, inclusions);
    }
    for (let value of values) {
      inclusions.add(value);
    }
  }

  public addConstraint(constraint: Constraint) {
    if (this.refinement === undefined) {
      this.refinement = [];
    }
    this.refinement.push(constraint);
  }

  public async includes(value: string): Promise<boolean> {
    return Action.inclusions.get(this.value)?.has(value) || false;
  }

  public static async getIncluded(values: ActionType[]): Promise<ActionType[]> {
    const foundValues: ActionType[] = [];
    values.forEach((value: ActionType) => {
      const includedValues = Action.inclusions.get(value);
      includedValues &&
        foundValues.push(...(Array.from(includedValues) as ActionType[]));
    });
    return Array.from(new Set(foundValues));
  }

  public async evaluate(): Promise<boolean> {
    const refine = this.refine();
    const rule = this.getParent();
    if (rule instanceof RuleDuty) {
      const all = await Promise.all([
        refine,
        (async (): Promise<boolean> => {
          try {
            const fetcher = this._rootUID
              ? EntityRegistry.getStateFetcherFromPolicy(this._rootUID)
              : undefined;
            if (fetcher) {
              return fetcher.context[this.value]();
            } else {
              console.warn(
                `\x1b[93m/!\\No state fetcher found, can't evaluate "${this.value}" action\x1b[37m`,
              );
            }
          } catch (error: any) {
            console.error(`No state found for "${this.value}" action`);
          }
          return false;
        })(),
      ]);
      return all.every(Boolean);
    }
    return refine;
  }

  public async refine(): Promise<boolean> {
    try {
      if (this.refinement) {
        const all = await Promise.all(
          this.refinement.map((constraint) => constraint.evaluate()),
        );
        return all.every(Boolean);
      }
    } catch (error) {
      console.error('Error while refining action:', error);
    }
    return true;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
