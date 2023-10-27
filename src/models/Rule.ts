import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { Constraint } from 'models/Constraint';
import { LogicalConstraint } from 'models/LogicalConstraint';
import { Party } from 'models/Party';
import { Relation } from 'models/Relation';

export class Rule {
  action: Action;
  target: Asset;
  assigner?: Party;
  assignee?: Party;
  asset?: Asset;
  parties?: Party[];
  failures?: Rule[];
  constraints: Constraint[];
  uid?: string;
  relation?: Relation;

  constructor(
    action: Action,
    target: Asset,
    constraints?: Constraint[],
    uid?: string,
    relation?: Relation,
  ) {
    this.action = action;
    this.target = target;
    this.constraints = constraints || [];
    this.uid = uid;
    this.relation = relation;
  }

  public getTarget(): Asset {
    return this.target;
  }
  public getConstraints(): Constraint[] {
    return this.constraints;
  }
  public getAction(): Action {
    return this.action;
  }

  async evaluate(): Promise<boolean> {
    try {
      if (this.constraints) {
        await Promise.all(
          this.constraints.map((constraint) => constraint.evaluate()),
        );
      }
      return true;
    } catch (error) {
      console.error('Error while evaluating rule:', error);
      return false;
    }
  }
}
