import { Explorable } from '../../Explorable';
import { Action } from './Action';
import { Asset } from './Asset';
import { Constraint } from './Constraint';
import { Party } from './Party';
import { Relation } from './Relation';

export abstract class Rule extends Explorable {
  action?: Action | Action[];
  target?: Asset;
  // Legal or moral entity that has established the obligation / author of the policy.
  assigner?: Party;
  // Individual or entity recipient of the obligation, required to comply with the policy.
  assignee?: Party;
  asset?: Asset;
  function?: Party[];
  failure?: Rule[];
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
