import { Party } from './Party';
import { RulePermission } from './RulePermission';
import { Policy } from './Policy';

export class PolicyAgreement extends Policy {
  '@type': 'Agreement' = 'Agreement';
  permission: RulePermission[] = [];
  assigner?: Party;
  assignee?: Party;

  constructor(uid: string, context: string) {
    super(uid, context, 'Agreement');
  }

  public setAssigner(assigner?: Party) {
    this.assigner = assigner;
  }

  public setAssignee(assignee?: Party) {
    this.assignee = assignee;
  }

  public async evaluate(): Promise<boolean> {
    return false;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
