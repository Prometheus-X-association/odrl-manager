import { Party } from './Party';
import { Rule } from './Rule';

export class RuleDuty extends Rule {
  private consequence?: RuleDuty[];
  public compensatedParty?: string;
  public compensatingParty?: string;
  constructor(assigner?: Party, assignee?: Party) {
    super();
    if (assigner) {
      this.assigner = assigner;
    }
    if (assignee) {
      this.assignee = assignee;
    }
  }

  public async visit(): Promise<boolean> {
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
