import { ContextFetcher } from 'ContextFetcher';
import { Policy } from './models/Policy';
import { Explorable } from 'Explorable';
import { Asset } from 'models/Asset';
import { RulePermission } from 'models/RulePermission';
import { RuleProhibition } from 'models/RuleProhibition';
import { Rule } from 'models/Rule';
import { ModelEssential } from 'ModelEssential';
import { Action, ActionType } from 'models/Action';
import { RuleDuty } from 'models/RuleDuty';

interface Picker {
  pick: (explorable: Explorable) => boolean;
  type: Function;
}
type Pickers = {
  [key: string]: Picker;
};

export class PolicyEvaluator {
  public static instance: PolicyEvaluator;
  private policy: Policy | null;
  private options: any | null;

  private readonly pickers: Pickers = {
    target: {
      pick: this.pickTarget.bind(this),
      type: Asset,
    },
    permission: {
      pick: this.pickPermission.bind(this),
      type: RulePermission,
    },
    prohibition: {
      pick: this.pickProhibition.bind(this),
      type: RuleProhibition,
    },
  };

  constructor() {
    this.policy = null;
  }

  public static getInstance(): PolicyEvaluator {
    if (!PolicyEvaluator.instance) {
      PolicyEvaluator.instance = new PolicyEvaluator();
    }
    return PolicyEvaluator.instance;
  }

  private pickTarget(explorable: Explorable): boolean {
    console.log('pickTarget');
    return true;
  }

  private pickPermission(explorable: Explorable): boolean {
    console.log('pickPermission');
    return true;
  }

  private pickProhibition(explorable: Explorable): boolean {
    console.log('pickProhibition');
    return true;
  }

  public setPolicy(policy: Policy): void {
    this.policy = policy;
  }

  public setFetcher(fetcher: ContextFetcher): void {
    ModelEssential.setFetcher(fetcher);
  }

  private pick = (explorable: Explorable): boolean => {
    for (const key in this.options) {
      if (this.options.hasOwnProperty(key)) {
        const picker: Picker = this.pickers[key];
        if (
          typeof picker.pick === 'function' &&
          explorable instanceof picker.type
        ) {
          const pickable = picker.pick(explorable);
          if (pickable) {
            return true;
          }
        }
      }
    }
    return false;
  };

  private async explore(options: any): Promise<Explorable[]> {
    if (this.policy) {
      this.options = options;
      const explorables: Explorable[] = await this.policy.explore(
        this.pick.bind(this),
      );
      return explorables;
    }
    return [];
  }

  public async getAllowedActionsOn(target: string): Promise<Explorable[]> {
    type ParentRule = RulePermission | RuleProhibition | RuleDuty;
    const targets: Asset[] = (await this.explore({
      target,
    })) as Asset[];

    // WIP
    targets.forEach(async (target: Asset) => {
      const parent: ParentRule = target.getParent() as ParentRule;
      console.log(JSON.stringify(target.getParent(), null, 2));
      console.log(await parent.visit(), '<<visit');
    });
    return [];
  }

  public async isActionPerformable(
    actionType: ActionType,
    target: string,
  ): Promise<boolean> {
    type ParentRule = RulePermission | RuleProhibition | RuleDuty;
    const targets: Asset[] = (await this.explore({
      target,
    })) as Asset[];
    const results = await targets.reduce(
      async (promise: Promise<boolean[]>, target: Asset) => {
        const acc = await promise;
        const parent: ParentRule = target.getParent() as ParentRule;
        const action: Action = parent.action as Action;
        return actionType === action?.value
          ? [...acc, await parent.visit()]
          : acc;
      },
      Promise.resolve([]),
    );
    return results.every((result) => result);
  }
}

export default PolicyEvaluator.getInstance();
