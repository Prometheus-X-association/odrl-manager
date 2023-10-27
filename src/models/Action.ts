import { Constraint } from 'models/Constraint';

export class Action {
  name: string;
  refinement?: Constraint[];
  includedIn: Action | null;
  implies?: Action[];

  constructor(name: string, includedIn: Action | null) {
    this.name = name;
    this.includedIn = includedIn;
  }
}
