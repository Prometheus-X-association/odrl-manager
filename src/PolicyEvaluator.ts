import { PolicyDataFetcher } from 'PolicyDataFetcher';
import { Policy } from './models/odrl/Policy';
import { Explorable } from 'models/Explorable';
import { Asset } from 'models/odrl/Asset';
import { RulePermission } from 'models/odrl/RulePermission';
import { RuleProhibition } from 'models/odrl/RuleProhibition';
import { Action, ActionType } from 'models/odrl/Action';
import { RuleDuty } from 'models/odrl/RuleDuty';
import { PolicyInstanciator } from 'PolicyInstanciator';
import { PolicyAgreement } from 'models/odrl/PolicyAgreement';
import { EntityRegistry } from 'EntityRegistry';
import { getNode } from 'utils';
import { Party } from 'models/odrl/Party';
import { Constraint } from 'models/odrl/Constraint';

interface Picker {
  pick: (explorable: Explorable, options?: any) => boolean;
  type: Function;
}
interface Pickers {
  [key: string]: Picker;
}
interface DutyOptionPayload {
  propertyName: string;
  uidPath: string;
  uidValue: string;
}
type ParentRule = RulePermission | RuleProhibition | RuleDuty;

export class PolicyEvaluator {
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
    pickDuties: {
      pick: this.pickDuties.bind(this),
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
    optionKey: string,
    explorable: Explorable,
    options: any,
  ): boolean {
    const payload: DutyOptionPayload = options[optionKey];
    if (
      (payload && explorable instanceof RuleDuty) ||
      explorable instanceof RulePermission ||
      explorable instanceof RuleProhibition ||
      explorable instanceof PolicyAgreement
    ) {
      const uid = getNode(explorable, payload.uidPath);
      return uid && uid === payload.uidValue;
    }
    return false;
  }

  private pickEmittedDuty(explorable: Explorable, options?: any): boolean {
    return this.pickEntityFor('assigner', explorable, options);
  }

  private pickAssignedDuty(explorable: Explorable, options?: any): boolean {
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

  private pickDuties(explorable: Explorable, options?: any): boolean {
    const isRuleDuty = explorable instanceof RuleDuty;
    if (isRuleDuty) {
      const pickable =
        options?.all === true ||
        ((explorable as RuleDuty)._type !== 'consequence' &&
          (explorable as RuleDuty)._type !== 'remedy');
      return pickable;
    }
    return false;
  }

  public cleanPolicies(): void {
    this.policies = [];
  }

  public addPolicy(policy: Policy, fetcher?: PolicyDataFetcher): void {
    if (fetcher) {
      policy._fetcherUID = fetcher._objectUID;
    }
    this.policies.push(policy);
  }

  public setPolicy(policy: Policy, fetcher?: PolicyDataFetcher): void {
    this.cleanPolicies();
    this.addPolicy(policy, fetcher);
  }

  public logPolicies(): void {
    this.policies.forEach((policy: Policy) => {
      policy.debug();
    });
  }

  private setFetcherOptions(options: any): void {
    try {
      if (!this.policies.length) {
        throw new Error(
          '[PolicyDataFetcher/setFetcherOptions]: Policy not found.',
        );
      }
      this.policies.forEach((policy: Policy) => {
        const fetcher = EntityRegistry.getDataFetcherFromPolicy(
          policy._objectUID,
        );
        if (!fetcher) {
          throw new Error(
            '[PolicyDataFetcher/setFetcherOptions]: Fetcher not found.',
          );
        } else {
          fetcher.setRequestOptions(options);
        }
      });
    } catch (error: any) {
      console.warn(`\x1b[93m/!\\${error.message}\x1b[37m`);
    }
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

  private static getAssigneePayload(assignee: string): DutyOptionPayload {
    const payload: DutyOptionPayload = {
      propertyName: 'assignee',
      uidPath: 'assignee.uid',
      uidValue: assignee,
    };
    return payload;
  }

  private static getAssignerPayload(assigner: string): DutyOptionPayload {
    const payload: DutyOptionPayload = {
      propertyName: 'assigner',
      uidPath: 'assigner.uid',
      uidValue: assigner,
    };
    return payload;
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
   * Retrieves the list of leftOperands associated with the specified target.
   * @param {string} target - A string representing the target.
   * @returns {Promise<string[]>} A promise resolved with an array of leftOperands.
   */
  public async listLeftOperandsFor(target: string): Promise<string[]> {
    const targets: Asset[] = (await this.explore({
      target,
    })) as Asset[];

    const leftOperands: Set<string> = new Set<string>();
    targets.forEach((target: Asset) => {
      const parent: ParentRule = target.getParent() as ParentRule;
      const constraints: Constraint[] = parent.getConstraints() || [];
      constraints.forEach((constraint: Constraint) => {
        const leftOperand = constraint.leftOperand;
        if (leftOperand) {
          const value = leftOperand.getValue();
          leftOperands.add(value);
        }
      });
    });
    return Array.from(leftOperands);
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
    const payload = PolicyEvaluator.getAssigneePayload(assignee);
    return (await this.explore({
      assignee: payload,
    })) as RuleDuty[];
  }

  public async getEmittedDuties(assigner: string): Promise<any[]> {
    const payload = PolicyEvaluator.getAssigneePayload(assigner);
    return (await this.explore({
      assigner: payload,
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
    this.setFetcherOptions({ assignee });
    const payload = PolicyEvaluator.getAssigneePayload(assignee);
    const entities: Explorable[] = (await this.explore({
      assignee: payload,
      // agreementAssignee: payload,
      // permissionAssignee: payload,
      // prohibitionAssignee: payload,
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
    this.setFetcherOptions({ assignee });
    const entities: Explorable[] = await this.explore({
      pickDuties: {
        parentEntityClass: [Policy],
      },
    });
    entities.filter((entity) => {
      const party: Party | undefined = (entity as RuleDuty).assignee;
      return !party?.uid;
    }) as Explorable[];
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
