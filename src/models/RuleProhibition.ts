import { Rule } from 'models/Rule';
import { RuleDuty } from './RuleDuty';

export class RuleProhibition extends Rule {
  remedy?: RuleDuty[];
  constructor() {
    super();
  }

  public async visit(): Promise<boolean> {
    return false;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
