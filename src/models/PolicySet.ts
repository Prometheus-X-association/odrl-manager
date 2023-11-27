import { RulePermission } from 'models/RulePermission';
import { Policy } from './Policy';

export class PolicySet extends Policy {
  '@type': 'Set' = 'Set';
  permission: RulePermission[] = [];

  constructor(uid: string, context: string) {
    super(uid, context, 'Set');
  }
}