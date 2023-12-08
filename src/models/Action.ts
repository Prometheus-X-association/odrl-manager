import { ModelEssential } from '../ModelEssential';
import { Constraint } from './Constraint';

export class Action extends ModelEssential {
  value: string;
  refinement?: Constraint[];
  includedIn: Action | null;
  implies?: Action[];

  constructor(value: string, includedIn: Action | null) {
    super();
    this.value = value;
    this.includedIn = includedIn;
  }

  public addConstraint(constraint: Constraint) {
    if (this.refinement === undefined) {
      this.refinement = [];
    }
    this.refinement.push(constraint);
  }
  public async verify(): Promise<boolean> {
    return true;
  }
}
