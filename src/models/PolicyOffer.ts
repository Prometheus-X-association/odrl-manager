import { Party } from 'models/Party';
import { RulePermission } from 'models/RulePermission';
import { Policy } from './Policy';

export class PolicyOffer extends Policy {
  '@type': 'Offer' = 'Offer';
  permission: RulePermission[] = [];
  assigner: Party | null = null;
  assignee: Party | null = null;

  constructor(uid: string, context: string) {
    super(uid, context, 'Offer');
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
