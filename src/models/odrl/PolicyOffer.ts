import { Party } from './Party';
import { RulePermission } from './RulePermission';
import { Policy } from './Policy';

export class PolicyOffer extends Policy {
  '@type': 'Offer' = 'Offer';
  permission: RulePermission[] = [];
  assigner?: Party;
  assignee?: Party;

  constructor(uid: string, context: string) {
    super(uid, context, 'Offer');
  }

  public async evaluate(): Promise<boolean> {
    return false;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
