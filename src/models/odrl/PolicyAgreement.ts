import { Party } from './Party';
import { RulePermission } from './RulePermission';
import { Policy } from './Policy';

export class PolicyAgreement extends Policy {
  '@type': 'Agreement' = 'Agreement';
  permission: RulePermission[] = [];
  assigner: Party | null = null;
  assignee: Party | null = null;

  constructor(uid: string, context: string) {
    super(uid, context, 'Agreement');
  }

  public async evaluate(): Promise<boolean> {
    return false;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
