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
    try {
      if (this.constraints) {
        const all = await Promise.all(
          this.constraints.map((constraint) => constraint.visit()),
        );
        return all.every(Boolean);
      }
    } catch (error) {
      console.error('Error while evaluating rule:', error);
    }
    return false;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
