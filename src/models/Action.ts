import { DebugMonitor } from 'DebugMonitor';
import { Constraint } from 'models/Constraint';

export class Action extends DebugMonitor {
  value: string;
  refinement?: Constraint[];
  includedIn: Action | null;
  implies?: Action[];

  constructor(value: string, includedIn: Action | null) {
    super();
    this.value = value;
    this.includedIn = includedIn;
  }
}
