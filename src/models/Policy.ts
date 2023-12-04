import { PolicyExplorer } from 'PolicyExplorer';
import { ConflictTerm } from 'models/ConflictTerm';
import { RuleDuty } from 'models/RuleDuty';
import { RulePermission } from 'models/RulePermission';
import { RuleProhibition } from 'models/RuleProhibition';

export abstract class Policy extends PolicyExplorer {
  protected '@context': string = '';
  protected '@type': string;
  protected uid: string;
  protected permission: RulePermission[];
  protected prohibition: RuleProhibition[];
  protected obligation: RuleDuty[];
  protected profile?: string[];
  protected inheritFrom?: string[];
  protected conflict?: ConflictTerm[];

  constructor(uid: string, context: string, type: string) {
    super();
    this['@type'] = type;
    this['@context'] = context;
    this.uid = uid;
    this.permission = [];
    this.prohibition = [];
    this.obligation = [];
  }

  public get permissions(): RulePermission[] {
    return this.permission;
  }
  public get prohibitions(): RuleProhibition[] {
    return this.prohibition;
  }
  public get obligations(): RulePermission[] {
    return this.permission;
  }
  public addPermission(permission: RulePermission): void {
    this.permission.push(permission);
  }
  public addProhibition(prohibition: RuleProhibition): void {
    this.prohibition.push(prohibition);
  }
  public addDuty(prohibition: RuleDuty): void {
    this.obligation.push(prohibition);
  }
  public async launchValidation(): Promise<boolean> {
    const validations: Promise<boolean>[] = [];
    this.validate(0, validations);
    return Promise.all(validations).then((results) =>
      results.every((result) => result),
    );
  }
}
