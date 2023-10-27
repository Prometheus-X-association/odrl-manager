import { Party } from 'models/Party';
import { RulePermission } from 'models/RulePermission';
import { Policy } from './Policy';

export class PolicyAgreement extends Policy {
  '@type': 'Agreement' = 'Agreement';
  permission: RulePermission[] = [];
  assigner: Party | null = null;
  assignee: Party | null = null;

  constructor(uid: string, context: string) {
    super(uid, context, 'Agreement');
  }
}
