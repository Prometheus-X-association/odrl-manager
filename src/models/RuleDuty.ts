import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { Constraint } from 'models/Constraint';
import { Party } from 'models/Party';
import { Rule } from 'models/Rule';

export class RuleDuty extends Rule {
  consequence?: RuleDuty[];

  constructor(
    action: Action,
    target: Asset,
    constraints?: Constraint[],
    assigner?: Party,
    assignee?: Party,
  ) {
    super(action, target, constraints);
    this.assigner = assigner;
    this.assignee = assignee;
  }
}
