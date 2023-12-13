import { ContextFetcher } from 'ContextFetcher';
import { Policy } from './models/Policy';
import { Explorable } from 'Explorable';
import { Asset } from 'models/Asset';
import { RulePermission } from 'models/RulePermission';
import { RuleProhibition } from 'models/RuleProhibition';
import { ModelEssential } from 'ModelEssential';
import { Action, ActionType } from 'models/Action';
import { RuleDuty } from 'models/RuleDuty';
import { PolicyInstanciator } from 'PolicyInstanciator';

interface Picker {
  pick: (explorable: Explorable, options?: any) => boolean;
  type: Function;
}
type Pickers = {
  [key: string]: Picker;
};
type ParentRule = RulePermission | RuleProhibition | RuleDuty;
export class PolicyEvaluator {
  public static instance: PolicyEvaluator;
  private policy: Policy | null;

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

  private pickTarget(explorable: Explorable, options?: any): boolean {
    if (explorable instanceof Asset) {
      const uid = (explorable as Asset).uid;
      const target = options?.target;
      if (typeof target === 'object') {
        return target.all || uid === target.uid;
      }
      return uid === target;
    }
    return false;
  }

  private pickPermission(explorable: Explorable, options?: any): boolean {
    console.log('pickPermission');
    return true;
  }

  private pickProhibition(explorable: Explorable, options?: any): boolean {
    console.log('pickProhibition');
    return true;
  }

  public setPolicy(policy: Policy): void {
    this.policy = policy;
  }

  public setFetcher(fetcher: ContextFetcher): void {
    ModelEssential.setFetcher(fetcher);
  }

  private pick = (explorable: Explorable, options?: any): boolean => {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const picker: Picker = this.pickers[key];
        if (
          typeof picker.pick === 'function' &&
          explorable instanceof picker.type
        ) {
          const pickable = picker.pick(explorable, options);
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
      const explorables: Explorable[] = await this.policy.explore(
        this.pick.bind(this),
        options,
      );
      return explorables;
    }
    return [];
  }

  /**
   * Retrieves a list of performable actions on the specified target.
   * @param target - A string representing the target
   * @returns A promise resolved with an array of performables actions.
   */
  public async getPerformableActions(target: string): Promise<string[]> {
    const targets: Asset[] = (await this.explore({
      target,
    })) as Asset[];
    const actionPromises: Record<string, Promise<boolean>[]> = {};
    targets.forEach((target: Asset) => {
      const parent: ParentRule = target.getParent() as ParentRule;
      const action: Action = parent.action as Action;
      if (!actionPromises[action.value]) {
        actionPromises[action.value] = [];
      }
      actionPromises[action.value].push(parent.visit());
    });
    const actions: string[] = [];
    for (const [action, promises] of Object.entries(actionPromises)) {
      const results = await Promise.all(promises);
      const isPerformable = results.every((result) => result);
      if (isPerformable) {
        actions.push(action);
      }
    }
    return actions;
  }

  /**
   * Verify if a specific action can be performed on a given target.
   * @param actionType - A string representing the action.
   * @param target - A string representing the target.
   * @returns Resolves with a boolean indicating action performability.
   */
  public async isActionPerformable(
    actionType: ActionType,
    target: string,
  ): Promise<boolean> {
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

  /**
   * Evaluates the exploitability of listed resources within a set of policies.
   * @param json - JSON representation of policies to be evaluated.
   * @returns A Promise resolving to a boolean indicating if the resources are exploitable.
   */
  public async evalResourcePerformabilities(json: any): Promise<boolean> {
    const instanciator = new PolicyInstanciator();
    instanciator.genPolicyFrom(json);
    const evaluator = new PolicyEvaluator();
    if (instanciator.policy) {
      evaluator.setPolicy(instanciator.policy);
    }
    const targets: Asset[] = (await evaluator.explore({
      target: { uid: '', all: true },
    })) as Asset[];
    const actionPromises: Promise<boolean>[] = targets.map(
      async (target: Asset) => {
        const parent: ParentRule = target.getParent() as ParentRule;
        const actionType = (parent.action as Action).value as ActionType;
        return target.uid
          ? this.isActionPerformable(actionType, target.uid)
          : false;
      },
    );
    const results = await Promise.all(actionPromises);
    return results.every((result) => result);
  }
}

export default PolicyEvaluator.getInstance();
