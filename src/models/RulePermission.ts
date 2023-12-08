import { Rule } from './Rule';
import { RuleDuty } from './RuleDuty';

export class RulePermission extends Rule {
  duty?: RuleDuty[];
  constructor() {
    super();
  }

  public addDuty(duty: RuleDuty) {
    if (this.duty === undefined) {
      this.duty = [];
    }
    this.duty.push(duty);
  }

  public async visit(): Promise<boolean> {
    return super.visit();
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
