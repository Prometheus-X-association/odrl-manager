import { PolicyExplorer } from 'PolicyExplorer';
import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { Constraint } from 'models/Constraint';
import { Party } from 'models/Party';
import { Relation } from 'models/Relation';

export abstract class Rule extends PolicyExplorer {
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

  public get constraints(): Constraint[] {
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

  protected async visit(): Promise<boolean> {
    try {
      if (this.constraints) {
        await Promise.all(
          this.constraints.map((constraint) => constraint.visit()),
        );
      }
      return true;
    } catch (error) {
      console.error('Error while evaluating rule:', error);
      return false;
    }
  }
}
