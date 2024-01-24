import { PolicyDataFetcher } from 'PolicyDataFetcher';
import { Policy } from './models/odrl/Policy';
import { Explorable } from 'models/Explorable';
import { Asset } from 'models/odrl/Asset';
import { RulePermission } from 'models/odrl/RulePermission';
import { RuleProhibition } from 'models/odrl/RuleProhibition';
import { ModelBasic } from 'models/ModelBasic';
import { Action, ActionType } from 'models/odrl/Action';
import { RuleDuty } from 'models/odrl/RuleDuty';
import { PolicyInstanciator } from 'PolicyInstanciator';
import { PolicyAgreement } from 'models/odrl/PolicyAgreement';
import { EntityRegistry } from 'EntityRegistry';

interface Picker {
  pick: (explorable: Explorable, options?: any) => boolean;
  type: Function;
}
type Pickers = {
  [key: string]: Picker;
};

type ParentRule = RulePermission | RuleProhibition | RuleDuty;

export class PolicyEvaluator {
  // private static fetcher?: PolicyDataFetcher;
  public static instance: PolicyEvaluator;
  private policies: Policy[];

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
    assignee: {
      pick: this.pickAssignedDuty.bind(this),
      type: RuleDuty,
    },
    assigner: {
      pick: this.pickEmittedDuty.bind(this),
      type: RuleDuty,
    },
    permissionAssignee: {
      pick: this.pickAssignedPermission.bind(this),
      type: RulePermission,
    },
    prohibitionAssignee: {
      pick: this.pickAssignedProhibition.bind(this),
      type: RuleProhibition,
    },
    agreementAssignee: {
      pick: this.pickAssignedAgreement.bind(this),
      type: PolicyAgreement,
    },
    // Pick all duties
    pickAllDuties: {
      pick: this.pickAllDuties.bind(this),
      type: RuleDuty,
    },
  };

  constructor() {
    this.policies = [];
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

  private pickEntityFor(
    entity: string,
    explorable: Explorable,
    options?: any,
  ): boolean {
    if (
      explorable instanceof RuleDuty ||
      explorable instanceof RulePermission ||
      explorable instanceof RuleProhibition ||
      explorable instanceof PolicyAgreement
    ) {
      const uid = explorable[entity as keyof typeof explorable];
      const _uid = options
        ? options[entity as keyof typeof explorable]
        : undefined;
      return _uid ? uid === _uid : false;
    }
    return false;
  }

  private pickEmittedDuty(explorable: Explorable, options?: any): boolean {
    return this.pickEntityFor('assigner', explorable, options);
  }

  private pickAssignedDuty(explorable: Explorable, options?: any): boolean {
    return this.pickEntityFor('assignee', explorable, options);
  }

  private pickAssignedPermission(
    explorable: Explorable,
    options?: any,
  ): boolean {
    return this.pickEntityFor('assignee', explorable, options);
  }

  private pickAssignedProhibition(
    explorable: Explorable,
    options?: any,
  ): boolean {
    return this.pickEntityFor('assignee', explorable, options);
  }

  private pickAssignedAgreement(
    explorable: Explorable,
    options?: any,
  ): boolean {
    return this.pickEntityFor('assignee', explorable, options);
  }

  private pickPermission(explorable: Explorable, options?: any): boolean {
    console.log('pickPermission');
    return true;
  }

  private pickProhibition(explorable: Explorable, options?: any): boolean {
    console.log('pickProhibition');
    return true;
  }

  private pickAllDuties(explorable: Explorable, options?: any): boolean {
    return explorable instanceof RuleDuty;
  }

  public cleanPolicies(): void {
    this.policies = [];
  }

  // Todo: optionnal fetcher
  public addPolicy(policy: Policy): void {
    this.policies.push(policy);
  }

  public setPolicy(policy: Policy): void {
    this.cleanPolicies();
    this.addPolicy(policy);
  }

  public logPolicies(): void {
    this.policies.forEach((policy: Policy) => {
      policy.debug();
    });
  }

  private set fetcher(fetcher: PolicyDataFetcher) {
    try {
      if (!this.policies.length) {
        throw new Error(
          'PolicyDataFetcher should be set after providing the reference policy.',
        );
      }
      this.policies.forEach((policy: Policy) => {
        policy._fetcherUID = fetcher._objectUID;
      });
    } catch (error: any) {
      console.warn(`\x1b[93m/!\\${error.message}\x1b[37m`);
    }
  }

  // Todo: review
  private get fetcher(): PolicyDataFetcher | undefined {
    const fetcherUID = this.policies?.[0]?._fetcherUID;
    if (fetcherUID) {
      const fetcher = EntityRegistry.getEntity(fetcherUID);
      return fetcher;
    }
  }

  public setFetcher(fetcher: PolicyDataFetcher): void {
    this.fetcher = fetcher;
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
    if (this.policies.length) {
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
  // Todo, include duties processes
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
      actionPromises[action.value].push(parent.evaluate());
    });
    const actions: ActionType[] = [];
    for (const [action, promises] of Object.entries(actionPromises)) {
      const results = await Promise.all(promises);
      const isPerformable = results.every((result) => result);
      if (isPerformable) {
        actions.push(action as ActionType);
      }
    }
    return Action.getIncluded(actions);
  }

  /**
   * Verifies whether a specific action can be performed on a given target.
   * @param {ActionType} actionType - A string representing the type of action.
   * @param {string} target - A string representing the target.
   * @param {boolean} defaultResult - A boolean defining the value to return if no corresponding target is found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating the feasibility of the action.
   */
  public async isActionPerformable(
    // Todo, include duties processes
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
        // evaluate permission & prohibition
        return (await action.includes(actionType))
          ? acc.concat(await parent.evaluate())
          : acc;
      },
      Promise.resolve([]),
    );
    return results.length ? results.every((result) => result) : defaultResult;
  }

  /**
   * Evaluates the exploitability of listed resources within a set of policies.
   * @param {any} json - JSON representation of policies to be evaluated.
   * @param {boolean} [defaultResult=false] - The default result if no resources are found.
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

  public async getDuties(): Promise<RuleDuty[]> {
    return (await this.explore({
      pickAllDuties: true,
    })) as RuleDuty[];
  }

  public async getAssignedDuties(assignee: string): Promise<RuleDuty[]> {
    return (await this.explore({
      assignee,
    })) as RuleDuty[];
  }

  public async getEmittedDuties(assigner: string): Promise<any[]> {
    return (await this.explore({
      assigner,
    })) as RuleDuty[];
  }

  /**
   * Evaluates whether the duties related to an assignee are fulfilled.
   * @param {string} assignee - The string value representing the assignee.
   * @param {boolean} [defaultResult=false] - The default result if no duties are found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the duties are fulfilled.
   */
  public async fulfillDuties(
    assignee: string,
    defaultResult: boolean = false,
  ): Promise<boolean> {
    const fetcher = this.fetcher;
    if (!fetcher) {
      throw new Error('[PolicyEvaluator/fulfillDuties]: Fetcher not found');
    } else {
      fetcher.setRequestOptions({
        assignee,
      });
    }
    const entities: Explorable[] = (await this.explore({
      assignee,
      agreementAssignee: assignee,
      permissionAssignee: assignee,
      prohibitionAssignee: assignee,
    })) as Explorable[];

    return this.evalDuties(entities, defaultResult);
  }

  /**
   * Evaluates whether the agreement is fulfilled by the assignee.
   * @param {boolean} [defaultResult=false] - The default result if no duties are found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the agreement is fulfilled.
   */
  public async evalAgreementForAssignee(
    assignee?: string,
    defaultResult: boolean = false,
  ): Promise<boolean> {
    // Todo:
    /*
    if (!assignee) {
      assignee = (this.policies?.[0] as PolicyAgreement).assignee;
    }
    */
    const fetcher = this.fetcher;
    if (!fetcher) {
      throw new Error(
        '[PolicyEvaluator/evalAgreementForAssignee]: Fetcher not found',
      );
    } else {
      fetcher.setRequestOptions({
        assignee,
      });
    }
    const entities: Explorable[] = (
      await this.explore({
        pickAllDuties: true,
      })
    ).filter((entity) => !(entity as RuleDuty).assignee) as Explorable[];
    return this.evalDuties(entities, defaultResult);
  }

  /**
   * Evaluates whether certain duties are fulfilled based on the related action conditions.
   * @param {Explorable[]} entities - An array of entities to be explored.
   * @param {boolean} [defaultResult=false] - The default result if no duties are found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the duties are fulfilled.
   */
  private async evalDuties(
    entities: Explorable[],
    defaultResult: boolean = false,
  ): Promise<boolean> {
    const results = await entities.reduce(
      async (promise: Promise<boolean[]>, entity: Explorable) => {
        const acc = await promise;
        if (entity instanceof RuleDuty) {
          return acc.concat(await (entity as RuleDuty).evaluate());
        }
        return acc;
      },
      Promise.resolve([]),
    );
    return results.length ? results.every((result) => result) : defaultResult;
  }

  // Todo: Retrieve the expected value for a specific duty action
}

export default PolicyEvaluator.getInstance();
