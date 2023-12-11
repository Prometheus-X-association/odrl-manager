import { Rule } from './Rule';
import { RuleDuty } from './RuleDuty';

export class RuleProhibition extends Rule {
  remedy?: RuleDuty[];
  constructor() {
    super();
  }

  public async visit(): Promise<boolean> {
    try {
      if (this.constraints) {
        const all = await Promise.all(
          this.constraints.map((constraint) => constraint.visit()),
        );
        return all.every((value) => value === false);
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
