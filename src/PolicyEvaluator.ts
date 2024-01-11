import { ContextFetcher } from 'ContextFetcher';
import { Policy } from './models/odrl/Policy';
import { Explorable } from 'Explorable';
import { Asset } from 'models/odrl/Asset';
import { RulePermission } from 'models/odrl/RulePermission';
import { RuleProhibition } from 'models/odrl/RuleProhibition';
import { ModelEssential } from 'ModelEssential';
import { Action, ActionType } from 'models/odrl/Action';
import { RuleDuty } from 'models/odrl/RuleDuty';
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
  private policies: Policy[] | null;

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
    this.policies = null;
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

  public cleanPolicies(): void {
    this.policies = [];
  }

  public addPolicy(policy: Policy): void {
    if (this.policies === null) {
      this.policies = [];
    }
    this.policies.push(policy);
  }

  public setPolicy(policy: Policy): void {
    this.cleanPolicies();
    this.addPolicy(policy);
  }

  public logPolicies(): void {
    if (this.policies?.length) {
      this.policies.forEach((policy: Policy) => {
        policy.debug();
      });
    }
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
    if (this.policies && this.policies.length) {
      const explorables: Explorable[] = (
        await Promise.all(
          this.policies.map(
            async (policy: Policy) =>
              await policy.explore(this.pick.bind(this), options),
          ),
        )
      ).flat();
      return explorables;
    }
    return [];
  }

  /**
   * Retrieves a list of performable actions on the specified target.
   * @param {string} target - A string representing the target.
   * @returns {Promise<string[]>} A promise resolved with an array of performable actions.
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
   * Verifies whether a specific action can be performed on a given target.
   * @param {ActionType} actionType - A string representing the type of action.
   * @param {string} target - A string representing the target.
   * @param {boolean} defaultResult - A boolean defining the value to return if no corresponding target is found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating the feasibility of the action.
   */
  public async isActionPerformable(
    actionType: ActionType,
    target: string,
    defaultResult: boolean = false,
  ): Promise<boolean> {
    const targets: Asset[] = (await this.explore({
      target,
    })) as Asset[];
    const results = await targets.reduce(
      async (promise: Promise<boolean[]>, target: Asset) => {
        const acc = await promise;
        const parent: ParentRule = target.getParent() as ParentRule;
        const action: Action = parent.action as Action;
        // return actionType === action?.value
        return (await action.isAllowed(actionType))
          ? [...acc, await parent.visit()]
          : acc;
      },
      Promise.resolve([]),
    );
    return results.length ? results.every((result) => result) : defaultResult;
  }

  /**
   * Evaluates the exploitability of listed resources within a set of policies.
   * @param {any} json - JSON representation of policies to be evaluated.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the resources are exploitable.
   */
  public async evalResourcePerformabilities(
    json: any,
    defaultResult: boolean = false,
  ): Promise<boolean> {
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
    return results.length ? results.every((result) => result) : defaultResult;
  }
}

export default PolicyEvaluator.getInstance();
