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

  public async evaluate(): Promise<boolean> {
    const result = await Promise.all([
      this.evaluateConstraints(),
      this.evaluateDuties(),
    ]);
    return result.every(Boolean);
  }

  private async evaluateDuties(): Promise<boolean> {
    try {
      if (this.duty) {
        const all = await Promise.all(this.duty.map((duty) => duty.evaluate()));
        return all.every(Boolean);
      }
    } catch (error) {
      console.error('Error while evaluating rule:', error);
    }
    return false;
  }

  private async evaluateConstraints(): Promise<boolean> {
    try {
      if (this.constraints) {
        const all = await Promise.all(
          this.constraints.map((constraint) => constraint.evaluate()),
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
