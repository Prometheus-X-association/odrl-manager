import { PolicyValidator } from 'PolicyValidator';
import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { Constraint } from 'models/Constraint';
import { LogicalConstraint } from 'models/LogicalConstraint';
import { Party } from 'models/Party';
import { Relation } from 'models/Relation';

export abstract class Rule extends PolicyValidator {
  action?: Action | Action[];
  target?: Asset;
  assigner?: Party;
  assignee?: Party;
  asset?: Asset;
  parties?: Party[];
  failures?: Rule[];
  protected constraint: Constraint[];
  uid?: string;
  relation?: Relation;

  constructor(uid?: string, relation?: Relation) {
    super();
    this.constraint = [];
    this.uid = uid;
    this.relation = relation;
  }

  public get constraints(): Constraint[] {
    return this.constraint;
  }
  public setTarget(asset: Asset): void {
    this.target = asset;
  }
  public setAction(action: Action): void {
    this.action = action;
  }
  public addAction(action: Action): void {
    if (this.action === undefined) {
      this.action = [];
    }
    (this.action as Array<Action>).push(action);
  }
  public addConstraint(constraint: Constraint) {
    this.constraints.push(constraint);
  }
  public getTarget(): Asset | undefined {
    return this.target;
  }
  public getAction(): Action | undefined | Action[] {
    return this.action;
  }
  public getConstraints(): Constraint[] {
    return this.constraints;
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
