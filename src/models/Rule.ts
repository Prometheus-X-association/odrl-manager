import { Explorable } from '../Explorable';
import { Action } from './Action';
import { Asset } from './Asset';
import { Constraint } from './Constraint';
import { Party } from './Party';
import { Relation } from './Relation';

export abstract class Rule extends Explorable {
  action?: Action | Action[];
  target?: Asset;
  assigner?: Party;
  assignee?: Party;
  asset?: Asset;
  parties?: Party[];
  failures?: Rule[];
  protected constraint?: Constraint[];
  uid?: string;
  relation?: Relation;

  constructor(uid?: string) {
    super();
    if (uid) {
      this.uid = uid;
    }
  }

  protected get constraints(): Constraint[] {
    if (this.constraint === undefined) {
      this.constraint = [];
    }
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
}
