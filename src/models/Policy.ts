import { ConflictTerm } from 'models/ConflictTerm';
import { RuleDuty } from 'models/RuleDuty';
import { RulePermission } from 'models/RulePermission';
import { RuleProhibition } from 'models/RuleProhibition';

export abstract class Policy {
  protected '@context': string = '';
  protected '@type': string;
  protected uid: string;
  protected permission: RulePermission[];
  protected prohibition: RuleProhibition[];
  protected obligation: RuleDuty[];
  protected profile?: string[] = [];
  protected inheritFrom?: string[] = [];
  protected conflict?: ConflictTerm[] = [];

  constructor(uid: string, context: string, type: string) {
    this['@type'] = type;
    this['@context'] = context;
    this.uid = uid;
    this.permission = [];
    this.prohibition = [];
    this.obligation = [];
  }

  get permissions(): RulePermission[] {
    return this.permission;
  }

  get prohibitions(): RulePermission[] {
    return this.permission;
  }

  get obligations(): RulePermission[] {
    return this.permission;
  }

  public addPermission(permission: RulePermission) {
    this.permissions.push(permission);
  }
}
