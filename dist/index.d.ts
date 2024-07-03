interface ContextFunctions {
    [key: string]: Function;
}
declare abstract class PolicyFetcher {
    private bypass;
    protected _context: ContextFunctions;
    _objectUID: string;
    protected options: any;
    constructor();
    setRequestOptions(options: any): void;
    hasBypassFor(name: string): boolean;
    setBypassFor(name: string): number;
    abstract get context(): ContextFunctions;
}

declare const Custom: () => MethodDecorator;
interface LeftOperandFunctions {
    absolutePosition: () => Promise<number>;
    absoluteSize: () => Promise<number>;
    absoluteSpatialPosition: () => Promise<[number, number]>;
    absoluteTemporalPosition: () => Promise<Date>;
    count: () => Promise<number>;
    dateTime: () => Promise<Date>;
    delayPeriod: () => Promise<number>;
    deliveryChannel: () => Promise<string>;
    device: () => Promise<string>;
    elapsedTime: () => Promise<number>;
    event: () => Promise<string>;
    fileFormat: () => Promise<string>;
    industry: () => Promise<string>;
    language: () => Promise<string>;
    media: () => Promise<string>;
    meteredTime: () => Promise<number>;
    payAmount: () => Promise<number>;
    percentage: () => Promise<number>;
    product: () => Promise<string>;
    purpose: () => Promise<string>;
    recipient: () => Promise<string>;
    relativePosition: () => Promise<number>;
    relativeSize: () => Promise<number>;
    relativeSpatialPosition: () => Promise<[number, number]>;
    relativeTemporalPosition: () => Promise<Date>;
    resolution: () => Promise<number>;
    spatial: () => Promise<string>;
    spatialCoordinates: () => Promise<[number, number]>;
    system: () => Promise<string>;
    systemDevice: () => Promise<string>;
    timeInterval: () => Promise<[Date, Date]>;
    unitOfCount: () => Promise<string>;
    version: () => Promise<string>;
    virtualLocation: () => Promise<string>;
    [key: string]: Function;
}
declare abstract class PolicyDataFetcher extends PolicyFetcher {
    private types;
    constructor();
    getTypes(leftOperand: string): string[];
    get context(): LeftOperandFunctions;
    protected getAbsolutePosition(): Promise<number>;
    protected getAbsoluteSize(): Promise<number>;
    protected getAbsoluteSpatialPosition(): Promise<[number, number]>;
    protected getAbsoluteTemporalPosition(): Promise<Date>;
    protected getCount(): Promise<number>;
    protected getDateTime(): Promise<Date>;
    protected getDelayPeriod(): Promise<number>;
    protected getDeliveryChannel(): Promise<string>;
    protected getDevice(): Promise<string>;
    protected getElapsedTime(): Promise<number>;
    protected getEvent(): Promise<string>;
    protected getFileFormat(): Promise<string>;
    protected getIndustry(): Promise<string>;
    protected getLanguage(): Promise<string>;
    protected getMedia(): Promise<string>;
    protected getMeteredTime(): Promise<number>;
    protected getPayAmount(): Promise<number>;
    protected getPercentage(): Promise<number>;
    protected getProduct(): Promise<string>;
    protected getPurpose(): Promise<string>;
    protected getRecipient(): Promise<string>;
    protected getRelativePosition(): Promise<number>;
    protected getRelativeSize(): Promise<number>;
    protected getRelativeSpatialPosition(): Promise<[number, number]>;
    protected getRelativeTemporalPosition(): Promise<Date>;
    protected getResolution(): Promise<number>;
    protected getSpatial(): Promise<string>;
    protected getSpatialCoordinates(): Promise<[number, number]>;
    protected getSystem(): Promise<string>;
    protected getSystemDevice(): Promise<string>;
    protected getTimeInterval(): Promise<[Date, Date]>;
    protected getUnitOfCount(): Promise<string>;
    protected getVersion(): Promise<string>;
    protected getVirtualLocation(): Promise<string>;
}

declare abstract class ModelBasic {
    _rootUID?: string;
    _objectUID: string;
    _fetcherUID?: string;
    _stateFetcherUID?: string;
    _instanceOf?: string;
    _namespace?: string | string[];
    constructor();
    protected handleFailure(): void;
    setParent(parent: ModelBasic): void;
    getParent(): ModelBasic;
    protected abstract verify(): Promise<boolean>;
    protected validate(depth: number | undefined, promises: Promise<boolean>[]): void;
    debug(depth?: number): void;
}

declare abstract class Explorable extends ModelBasic {
    protected abstract evaluate(): Promise<boolean>;
    protected explore(pick: Function, depth: number | undefined, entities: Explorable[], options?: any): void;
}

declare class ConflictTerm extends ModelBasic {
    verify(): Promise<boolean>;
}

declare class Party extends ModelBasic {
    uid: string;
    private partOf?;
    constructor(uid: string);
    verify(): Promise<boolean>;
}

declare class LeftOperand extends ModelBasic {
    value: string;
    constructor(value: string);
    getValue(): string;
    evaluate(): Promise<[string | number, string[]] | null>;
    verify(): Promise<boolean>;
}

declare class Operator extends ModelBasic {
    static readonly EQ: string;
    static readonly NEQ: string;
    static readonly GT: string;
    static readonly GTEQ: string;
    static readonly LT: string;
    static readonly LTEQ: string;
    static readonly IS_PART_OF: string;
    static readonly HAS_PART: string;
    static readonly IS_A: string;
    static readonly IS_ALL_OF: string;
    static readonly IS_ANY_OF: string;
    static readonly IS_NONE_OF: string;
    static readonly NE: string;
    static readonly GTE: string;
    static readonly LTE: string;
    value: string;
    constructor(value: string);
    verify(): Promise<boolean>;
}

declare class RightOperand extends ModelBasic {
    '@id'?: string;
    value: string | number | [];
    constructor(value: string | number);
    verify(): Promise<boolean>;
}

declare abstract class Constraint extends ModelBasic {
    uid?: string;
    dataType?: string;
    unit?: string;
    status?: number;
    operator: Operator | null;
    leftOperand: LeftOperand | null;
    rightOperand: RightOperand | null;
    private rightOperandReference?;
    private logicalConstraints?;
    constructor(leftOperand: LeftOperand | null, operator: Operator | null, rightOperand: RightOperand | null);
    evaluate(): Promise<boolean>;
    protected verify(): Promise<boolean>;
}

declare const actions: readonly ["Attribution", "CommericalUse", "DerivativeWorks", "Distribution", "Notice", "Reproduction", "ShareAlike", "Sharing", "SourceCode", "acceptTracking", "adHocShare", "aggregate", "annotate", "anonymize", "append", "appendTo", "archive", "attachPolicy", "attachSource", "attribute", "commercialize", "compensate", "concurrentUse", "copy", "delete", "derive", "digitize", "display", "distribute", "ensureExclusivity", "execute", "export", "extract", "extractChar", "extractPage", "extractWord", "give", "grantUse", "include", "index", "inform", "install", "lease", "lend", "license", "modify", "move", "nextPolicy", "obtainConsent", "pay", "play", "present", "preview", "print", "read", "reproduce", "reviewPolicy", "secondaryUse", "sell", "share", "shareAlike", "stream", "synchronize", "textToSpeech", "transfer", "transform", "translate", "uninstall", "use", "watermark", "write", "writeTo"];
type ActionType = (typeof actions)[number];
declare class Action extends ModelBasic {
    private static inclusions;
    value: string;
    refinement?: Constraint[];
    includedIn: Action | null;
    implies?: Action[];
    constructor(value: string, includedIn: Action | null);
    static includeIn(current: string, values: string[]): void;
    addConstraint(constraint: Constraint): void;
    includes(value: string): Promise<boolean>;
    static getIncluded(values: ActionType[]): Promise<ActionType[]>;
    evaluate(): Promise<boolean>;
    refine(): Promise<boolean>;
    verify(): Promise<boolean>;
}

declare class AssetCollection extends Asset {
    source?: string;
    refinement?: Constraint[];
}

declare class Asset extends Explorable {
    uid?: string;
    partOf?: AssetCollection[];
    hasPolicy?: string;
    constructor(target: string | {
        uid?: string;
        partOf?: AssetCollection[];
        hasPolicy?: string;
    });
    protected evaluate(): Promise<boolean>;
    verify(): Promise<boolean>;
}

declare enum RelationType {
    TARGET = "target"
}
declare class Relation extends ModelBasic {
    type: RelationType;
    asset: Asset;
    constructor(type: RelationType, asset: Asset);
    verify(): Promise<boolean>;
}

declare abstract class Rule extends Explorable {
    action?: Action | Action[];
    target?: Asset;
    assigner?: Party;
    assignee?: Party;
    asset?: Asset;
    function?: Party[];
    failure?: Rule[];
    protected constraint?: Constraint[];
    uid?: string;
    relation?: Relation;
    constructor(uid?: string);
    get constraints(): Constraint[];
    setTarget(asset: Asset): void;
    setAction(action: Action): void;
    addAction(action: Action): void;
    addConstraint(constraint: Constraint): void;
    getTarget(): Asset | undefined;
    getAction(): Action | undefined | Action[];
    getConstraints(): Constraint[];
}

declare class RuleDuty extends Rule {
    _type?: 'consequence' | 'remedy' | 'obligation' | 'duty';
    private consequence?;
    compensatedParty?: string;
    compensatingParty?: string;
    private status?;
    constructor(assigner?: Party, assignee?: Party);
    evaluate(): Promise<boolean>;
    private evaluateActions;
    private evaluateConstraints;
    verify(): Promise<boolean>;
    addConsequence(consequence: RuleDuty): void;
}

declare class RulePermission extends Rule {
    duty?: RuleDuty[];
    constructor();
    addDuty(duty: RuleDuty): void;
    evaluate(): Promise<boolean>;
    private evaluateDuties;
    private evaluateConstraints;
    verify(): Promise<boolean>;
}

declare class RuleProhibition extends Rule {
    remedy?: RuleDuty[];
    constructor();
    addRemedy(duty: RuleDuty): void;
    evaluate(): Promise<boolean>;
    private evaluateRemedies;
    private evaluateConstraints;
    verify(): Promise<boolean>;
}

type PolicyContext = string | {
    [key: string]: string;
}[];
declare abstract class Policy extends Explorable {
    protected '@context': PolicyContext;
    protected '@type': string;
    protected uid: string;
    protected permission: RulePermission[];
    protected prohibition: RuleProhibition[];
    protected obligation: RuleDuty[];
    protected profile?: string[];
    protected inheritFrom?: string[];
    protected conflict?: ConflictTerm[];
    constructor(uid: string, context: PolicyContext, type: string);
    get permissions(): RulePermission[];
    get prohibitions(): RuleProhibition[];
    get obligations(): RulePermission[];
    addPermission(permission: RulePermission): void;
    addProhibition(prohibition: RuleProhibition): void;
    addDuty(prohibition: RuleDuty): void;
    validate(): Promise<boolean>;
    explore(picker: Function, options?: any): Promise<Explorable[]>;
}

interface StateFunctions {
    [key: string]: Function;
}
declare abstract class PolicyStateFetcher extends PolicyFetcher {
    constructor();
    get context(): StateFunctions;
}

declare class PolicyEvaluator {
    static instance: PolicyEvaluator;
    private policies;
    private readonly pickers;
    constructor();
    static getInstance(): PolicyEvaluator;
    private pickTarget;
    private pickEntityFor;
    private pickEmittedDuty;
    private pickAssignedDuty;
    private pickPermission;
    private pickProhibition;
    private pickDuties;
    cleanPolicies(): void;
    addPolicy(policy: Policy, dataFetcher?: PolicyDataFetcher, stateFetcher?: PolicyStateFetcher): void;
    setPolicy(policy: Policy, dataFetcher?: PolicyDataFetcher, stateFetcher?: PolicyStateFetcher): void;
    logPolicies(): void;
    private setFetcherOptions;
    private pick;
    private explore;
    private static getAssigneePayload;
    private static getAssignerPayload;
    /**
     * Retrieves a list of performable actions on the specified target.
     * @param {string} target - A string representing the target.
     * @returns {Promise<string[]>} A promise resolved with an array of performable actions.
     */
    getPerformableActions(target: string, included?: boolean): Promise<string[]>;
    /**
     * Retrieves the list of leftOperands associated with the specified target.
     * @param {string} target - A string representing the target.
     * @returns {Promise<string[]>} A promise resolved with an array of leftOperands.
     */
    listLeftOperandsFor(target: string): Promise<string[]>;
    /**
     * Verifies whether a specific action can be performed on a given target.
     * @param {ActionType} actionType - A string representing the type of action.
     * @param {string} target - A string representing the target.
     * @param {boolean} defaultResult - A boolean defining the value to return if no corresponding target is found.
     * @returns {Promise<boolean>} Resolves with a boolean indicating the feasibility of the action.
     */
    isActionPerformable(actionType: ActionType, target: string, defaultResult?: boolean): Promise<boolean>;
    /**
     * Evaluates the exploitability of listed resources within a set of policies.
     * @param {any} json - JSON representation of policies to be evaluated.
     * @param {boolean} [defaultResult=false] - The default result if no resources are found.
     * @returns {Promise<boolean>} Resolves with a boolean indicating whether the resources are exploitable.
     */
    evalResourcePerformabilities(json: any, defaultResult?: boolean): Promise<boolean>;
    getDuties(): Promise<RuleDuty[]>;
    getDutiesForTarget(target: string, fulfilled?: boolean): Promise<RuleDuty[]>;
    getDutiesFor(action: string, target: string, fulfilled?: boolean): Promise<RuleDuty[]>;
    getAssignedDuties(assignee: string): Promise<RuleDuty[]>;
    getEmittedDuties(assigner: string): Promise<any[]>;
    /**
     * Evaluates whether the duties related to an assignee are fulfilled.
     * @param {string} assignee - The string value representing the assignee.
     * @param {boolean} [defaultResult=false] - The default result if no duties are found.
     * @returns {Promise<boolean>} Resolves with a boolean indicating whether the duties are fulfilled.
     */
    fulfillDuties(assignee: string, defaultResult?: boolean): Promise<boolean>;
    /**
     * Evaluates whether the agreement is fulfilled by the assignee.
     * @param {boolean} [defaultResult=false] - The default result if no duties are found.
     * @returns {Promise<boolean>} Resolves with a boolean indicating whether the agreement is fulfilled.
     */
    evalAgreementForAssignee(assignee?: string, defaultResult?: boolean): Promise<boolean>;
    /**
     * Evaluates whether certain duties are fulfilled based on the related action conditions.
     * @param {Explorable[]} entities - An array of entities to be explored.
     * @param {boolean} [defaultResult=false] - The default result if no duties are found.
     * @returns {Promise<boolean>} Resolves with a boolean indicating whether the duties are fulfilled.
     */
    private evalDuties;
}

declare class PolicyInstanciator {
    policy: Policy | null;
    static instance: PolicyInstanciator;
    constructor();
    static getInstance(): PolicyInstanciator;
    private static readonly instanciators;
    private static setPermission;
    private static setProhibition;
    private static setObligation;
    private static setDuty;
    private static setAction;
    private static setTarget;
    private static setConstraint;
    private static setRefinement;
    private static setRemedy;
    private static setConsequence;
    private selectPolicyType;
    genPolicyFrom(json: any): Policy | null;
    traverse(node: any, parent: any): void;
    static construct<T>(Type: new (...args: any[]) => T, ...args: any[]): T;
}

declare const evaluator: PolicyEvaluator;
declare const instanciator: PolicyInstanciator;

export { type ActionType, Custom, PolicyDataFetcher, PolicyEvaluator, PolicyInstanciator, evaluator, instanciator };
