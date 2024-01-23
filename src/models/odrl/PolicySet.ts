import { RulePermission } from './RulePermission';
import { Policy } from './Policy';

export class PolicySet extends Policy {
  '@type': 'Set' = 'Set';
  permission: RulePermission[] = [];

  constructor(uid: string, context: string) {
    super(uid, context, 'Set');
  }

  public async evaluate(): Promise<boolean> {
    return false;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
