import { Action } from './Action';
import { Party } from './Party';
import { Rule } from './Rule';

export class RuleDuty extends Rule {
  public _type?: 'consequence' | 'remedy' | 'obligation' | 'duty';
  private consequence?: RuleDuty[];
  public compensatedParty?: string;
  public compensatingParty?: string;
  private status?: 'notInfringed' | 'infringed';
  constructor(assigner?: Party, assignee?: Party) {
    super();
    if (assigner) {
      this.assigner = assigner;
    }
    if (assignee) {
      this.assignee = assignee;
    }
  }

  public async evaluate(): Promise<boolean> {
    const result = await Promise.all([
      this.evaluateConstraints(),
      this.evaluateActions(),
    ]);
    return result.every(Boolean);
  }

  private async evaluateActions(): Promise<boolean> {
    if (Array.isArray(this.action)) {
      const processes = await Promise.all(
        this.action.map((action: Action) => action.refine()),
      );
      return processes.every(Boolean);
    } else if (this.action instanceof Action) {
      return this.action.evaluate();
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

  public addConsequence(consequence: RuleDuty) {
    if (this.consequence === undefined) {
      this.consequence = [];
    }
    this.consequence.push(consequence);
  }
}
