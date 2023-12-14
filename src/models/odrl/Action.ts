import { ModelEssential } from '../../ModelEssential';
import { Constraint } from './Constraint';

const actions = [
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

export class Action extends ModelEssential {
  value: string;
  refinement?: Constraint[];
  includedIn: Action | null;
  implies?: Action[];

  constructor(value: string, includedIn: Action | null) {
    super();
    this.value = value;
    this.includedIn = includedIn;
  }

  public addConstraint(constraint: Constraint) {
    if (this.refinement === undefined) {
      this.refinement = [];
    }
    this.refinement.push(constraint);
  }
  public async verify(): Promise<boolean> {
    return true;
  }
}
