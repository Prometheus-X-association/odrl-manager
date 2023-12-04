import { Party } from 'models/Party';
import { Rule } from 'models/Rule';

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
