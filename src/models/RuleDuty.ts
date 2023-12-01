import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { Constraint } from 'models/Constraint';
import { Party } from 'models/Party';
import { Rule } from 'models/Rule';

export class RuleDuty extends Rule {
  private consequence?: RuleDuty[];
  public compensatedParty?: string;
  public compensatingParty?: string;
  constructor(assigner?: Party, assignee?: Party) {
    super();
    this.assigner = assigner;
    this.assignee = assignee;
  }

  public async verify(): Promise<boolean> {
    if (typeof this.assigner !== 'string') {
      console.warn('Warning: [RuleDuty] - Assigner is not defined');
      console.warn(`\tTarget: ${this.target?.uid}`);
    }
    return true;
  }

  public addConsequence(consequence: RuleDuty) {
    if (this.consequence === undefined) {
      this.consequence = [];
    }
    this.consequence.push(consequence);
  }
}
