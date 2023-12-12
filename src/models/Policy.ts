import { Explorable } from '../Explorable';
import { ConflictTerm } from './ConflictTerm';
import { RuleDuty } from './RuleDuty';
import { RulePermission } from './RulePermission';
import { RuleProhibition } from './RuleProhibition';

export abstract class Policy extends Explorable {
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
  public async validate(): Promise<boolean> {
    const promises: Promise<boolean>[] = [];
    super.validate(0, promises);
    return Promise.all(promises).then((results) =>
      results.every((result) => result),
    );
  }

  public async explore(picker: Function, options?: any): Promise<Explorable[]> {
    const explorables: Explorable[] = [];
    super.explore(picker, 0, explorables, options);
    return explorables;
  }
}
