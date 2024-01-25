import { Party } from './Party';
import { Rule } from './Rule';

export class RuleDuty extends Rule {
  // public _isConsequence?: boolean;
  // public _isRemedy?: boolean;
  public _type?: 'consequence' | 'remedy' | 'obligation' | 'duty';
  private consequence?: RuleDuty[];
  public compensatedParty?: string;
  public compensatingParty?: string;
  private status?: 'notInfringed' | 'infringed';
  constructor(assigner?: Party, assignee?: Party) {
    super();
    if (assigner) {
      this.assigner = assigner;
    }
    if (assignee) {
      this.assignee = assignee;
    }
  }

  public async evaluate(): Promise<boolean> {
    const actions = this.action;
    if (Array.isArray(actions)) {
      const processes = await Promise.all(
        actions.map((action) => action.refine()),
      );
      return processes.every(Boolean);
    }
    return false;
  }

  public async verify(): Promise<boolean> {
    return true;
  }

  public addConsequence(consequence: RuleDuty) {
    if (this.consequence === undefined) {
      this.consequence = [];
    }
    this.consequence.push(consequence);
  }
}
