import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { Constraint } from 'models/Constraint';
import { Party } from 'models/Party';
import { Rule } from 'models/Rule';

export class RuleDuty extends Rule {
  consequence?: RuleDuty[];
  constructor(assigner?: Party, assignee?: Party) {
    super();
    this.assigner = assigner;
    this.assignee = assignee;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
