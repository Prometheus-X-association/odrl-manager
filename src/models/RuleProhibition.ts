import { Rule } from 'models/Rule';
import { RuleDuty } from './RuleDuty';

export class RuleProhibition extends Rule {
  remedy?: RuleDuty[];
  constructor() {
    super();
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
