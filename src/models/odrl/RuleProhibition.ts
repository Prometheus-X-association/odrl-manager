import { HandleFailure } from 'ModelEssential';
import { Rule } from './Rule';
import { RuleDuty } from './RuleDuty';

export class RuleProhibition extends Rule {
  remedy?: RuleDuty[];
  constructor() {
    super();
  }

  public addRemedy(duty: RuleDuty) {
    if (this.remedy === undefined) {
      this.remedy = [];
    }
    this.remedy.push(duty);
  }

  public async evaluate(): Promise<boolean> {
    const result = await Promise.all([
      this.evaluateConstraints(),
      this.evaluateRemedies(),
    ]);
    return result.every(Boolean);
  }

  private async evaluateRemedies(): Promise<boolean> {
    try {
      if (this.remedy) {
        const all = await Promise.all(
          this.remedy.map((remedy) => remedy.evaluate()),
        );
        return all.every(Boolean);
      }
      return true;
    } catch (error) {
      console.error('Error while evaluating rule:', error);
    }
    return false;
  }

  // Todo: @HandleFailure()
  private async evaluateConstraints(): Promise<boolean> {
    try {
      if (this.constraints) {
        const all = await Promise.all(
          this.constraints.map((constraint) => constraint.evaluate()),
        );
        if (all.length) {
          return all.every((value) => value === false);
        }
        return false;
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
