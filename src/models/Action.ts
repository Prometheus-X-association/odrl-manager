import { PolicyValidator } from 'PolicyValidator';
import { Constraint } from 'models/Constraint';

export class Action extends PolicyValidator {
  value: string;
  refinement?: Constraint[];
  includedIn: Action | null;
  implies?: Action[];

  constructor(value: string, includedIn: Action | null) {
    super();
    this.value = value;
    this.includedIn = includedIn;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
