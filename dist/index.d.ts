type ExtensionValue = ModelBasic | unknown | null;
interface Extension {
    name: string;
    value: ExtensionValue;
}
/**
 * Abstract class representing a basic ODRL model entity
 */
declare abstract class ModelBasic {
    _rootUID?: string;
    _objectUID: string;
    _fetcherUID?: string;
    _stateFetcherUID?: string;
    _instanceOf?: string;
    _namespace?: string | string[];
    _extension?: string;
    constructor();
    /**
     * Handles the failure state of a model evaluation
     * @param {boolean} result - The result of the evaluation
     * @protected
     */
    protected handleFailure(result: boolean): Promise<void>;
    /**
     * Adds an extension to the current target object. An extension is an additional property
     * that can be attached to a policy to extend its functionality as decribed by it's context.
     *
     * @param {Extension} ext - The extension to add, containing a name and a value.
     * @param {string} prefix - The prefix (or context) associated with the extension, used to
     *                          identify the namespace from which the extension originates.
     * @returns {void}
     */
    addExtension(ext: Extension, prefix: string): void;
    /**
     * Sets the parent of this model
     * @param {ModelBasic} parent - The parent model to set
     */
    setParent(parent: ModelBasic): void;
    /**
     * Gets the parent of this model
     * @returns {ModelBasic} The parent model
     */
    getParent(): ModelBasic;
    protected abstract verify(): Promise<boolean>;
    /**
     * Validates the model and its children recursively
     * @param {number} depth - The current depth in the validation tree
     * @param {Promise<boolean>[]} promises - Array of validation promises
     */
    protected validate(depth: number | undefined, promises: Promise<boolean>[]): void;
    /**
     * Outputs a debug representation of the model
     * @param {number} depth - The current depth in the debug tree
     */
    debug(depth?: number): void;
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

declare class LeftOperand extends ModelBasic {
    value: string;
    /**
     * Creates an instance of LeftOperand
     * @param {string} value - The value to be assigned to the left operand
     */
    constructor(value: string);
    /**
     * Gets the value of the left operand
     * @returns {string} The value of the left operand
     */
    getValue(): string;
    /**
     * Evaluates the left operand by fetching and processing its value
     * @returns {Promise<[string | number, string[]] | null>} A tuple containing the evaluated value and its types, or null if evaluation fails
     */
    evaluate(): Promise<[string | number, string[]] | null>;
    /**
     * Verifies the left operand
     * @returns {Promise<boolean>} Always returns true
     */
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

declare class AtomicConstraint extends Constraint {
    /**
     * Creates an instance of AtomicConstraint.
     * @param {LeftOperand} leftOperand - The left operand of the constraint
     * @param {Operator} operator - The operator to apply between operands
     * @param {RightOperand} rightOperand - The right operand of the constraint
     */
    constructor(leftOperand: LeftOperand, operator: Operator, rightOperand: RightOperand);
    /**
     * Evaluates the atomic constraint by comparing left and right operands
     * @returns {Promise<boolean>} True if the constraint evaluation succeeds, false otherwise
     */
    evaluate(): Promise<boolean>;
    /**
     * Verifies that the atomic constraint has valid operands and operator
     * @returns {Promise<boolean>} True if the constraint is valid, throws an error otherwise
     */
    verify(): Promise<boolean>;
    private static isA;
}

interface ContextFunctions {
    [key: string]: Function;
}
declare abstract class PolicyFetcher {
    private bypass;
    protected _context: ContextFunctions;
    _objectUID: string;
    protected options: any;
    protected currentNode?: AtomicConstraint;
    constructor();
    /**
     * Sets options for the policy request
     * @param {any} options - The options to set
     */
    setRequestOptions(options: any): void;
    /**
     * Sets the current node being processed
     * @param {ModelBasic} node - The node to set as current
     */
    setCurrentNode(node: ModelBasic): void;
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
    /**
     * Gets the types associated with a left operand
     * @param {string} leftOperand - The left operand to get types for
     * @returns {string[]} Array of types
     */
    getTypes(leftOperand: string): string[];
    /**
     * Gets the context containing left operand functions
     * @returns {LeftOperandFunctions} The left operand functions context
     */
    get context(): LeftOperandFunctions;
    /**
     * Gets the absolute position
     * @returns {Promise<number>} The absolute position
     */
    protected getAbsolutePosition(): Promise<number>;
    /**
     * Gets the absolute size
     * @returns {Promise<number>} The absolute size
     */
    protected getAbsoluteSize(): Promise<number>;
    /**
     * Gets the absolute spatial position
     * @returns {Promise<[number, number]>} The absolute spatial position
     */
    protected getAbsoluteSpatialPosition(): Promise<[number, number]>;
    /**
     * Gets the absolute temporal position
     * @returns {Promise<Date>} The absolute temporal position
     */
    protected getAbsoluteTemporalPosition(): Promise<Date>;
    /**
     * Gets the count
     * @returns {Promise<number>} The count
     */
    protected getCount(): Promise<number>;
    /**
     * Gets the date and time
     * @returns {Promise<Date>} The date and time
     */
    protected getDateTime(): Promise<Date>;
    /**
     * Gets the delay period
     * @returns {Promise<number>} The delay period
     */
    protected getDelayPeriod(): Promise<number>;
    /**
     * Gets the delivery channel
     * @returns {Promise<string>} The delivery channel
     */
    protected getDeliveryChannel(): Promise<string>;
    /**
     * Gets the device
     * @returns {Promise<string>} The device
     */
    protected getDevice(): Promise<string>;
    /**
     * Gets the elapsed time
     * @returns {Promise<number>} The elapsed time
     */
    protected getElapsedTime(): Promise<number>;
    /**
     * Gets the event
     * @returns {Promise<string>} The event
     */
    protected getEvent(): Promise<string>;
    /**
     * Gets the file format
     * @returns {Promise<string>} The file format
     */
    protected getFileFormat(): Promise<string>;
    /**
     * Gets the industry
     * @returns {Promise<string>} The industry
     */
    protected getIndustry(): Promise<string>;
    /**
     * Gets the language
     * @returns {Promise<string>} The language
     */
    protected getLanguage(): Promise<string>;
    /**
     * Gets the media
     * @returns {Promise<string>} The media
     */
    protected getMedia(): Promise<string>;
    /**
     * Gets the metered time
     * @returns {Promise<number>} The metered time
     */
    protected getMeteredTime(): Promise<number>;
    /**
     * Gets the pay amount
     * @returns {Promise<number>} The pay amount
     */
    protected getPayAmount(): Promise<number>;
    /**
     * Gets the percentage
     * @returns {Promise<number>} The percentage
     */
    protected getPercentage(): Promise<number>;
    /**
     * Gets the product
     * @returns {Promise<string>} The product
     */
    protected getProduct(): Promise<string>;
    /**
     * Gets the purpose
     * @returns {Promise<string>} The purpose
     */
    protected getPurpose(): Promise<string>;
    /**
     * Gets the recipient
     * @returns {Promise<string>} The recipient
     */
    protected getRecipient(): Promise<string>;
    /**
     * Gets the relative position
     * @returns {Promise<number>} The relative position
     */
    protected getRelativePosition(): Promise<number>;
    /**
     * Gets the relative size
     * @returns {Promise<number>} The relative size
     */
    protected getRelativeSize(): Promise<number>;
    /**
     * Gets the relative spatial position
     * @returns {Promise<[number, number]>} The relative spatial position
     */
    protected getRelativeSpatialPosition(): Promise<[number, number]>;
    /**
     * Gets the relative temporal position
     * @returns {Promise<Date>} The relative temporal position
     */
    protected getRelativeTemporalPosition(): Promise<Date>;
    /**
     * Gets the resolution
     * @returns {Promise<number>} The resolution
     */
    protected getResolution(): Promise<number>;
    /**
     * Gets the spatial
     * @returns {Promise<string>} The spatial
     */
    protected getSpatial(): Promise<string>;
    /**
     * Gets the spatial coordinates
     * @returns {Promise<[number, number]>} The spatial coordinates
     */
    protected getSpatialCoordinates(): Promise<[number, number]>;
    /**
     * Gets the system
     * @returns {Promise<string>} The system
     */
    protected getSystem(): Promise<string>;
    /**
     * Gets the system device
     * @returns {Promise<string>} The system device
     */
    protected getSystemDevice(): Promise<string>;
    /**
     * Gets the time interval
     * @returns {Promise<[Date, Date]>} The time interval
     */
    protected getTimeInterval(): Promise<[Date, Date]>;
    /**
     * Gets the unit of count
     * @returns {Promise<string>} The unit of count
     */
    protected getUnitOfCount(): Promise<string>;
    /**
     * Gets the version
     * @returns {Promise<string>} The version
     */
    protected getVersion(): Promise<string>;
    /**
     * Gets the virtual location
     * @returns {Promise<string>} The virtual location
     */
    protected getVirtualLocation(): Promise<string>;
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

declare const actions: readonly ["Attribution", "CommericalUse", "DerivativeWorks", "Distribution", "Notice", "Reproduction", "ShareAlike", "Sharing", "SourceCode", "acceptTracking", "adHocShare", "aggregate", "annotate", "anonymize", "append", "appendTo", "archive", "attachPolicy", "attachSource", "attribute", "commercialize", "compensate", "concurrentUse", "copy", "delete", "derive", "digitize", "display", "distribute", "ensureExclusivity", "execute", "export", "extract", "extractChar", "extractPage", "extractWord", "give", "grantUse", "include", "index", "inform", "install", "lease", "lend", "license", "modify", "move", "nextPolicy", "obtainConsent", "pay", "play", "present", "preview", "print", "read", "reproduce", "reviewPolicy", "secondaryUse", "sell", "share", "shareAlike", "stream", "synchronize", "textToSpeech", "transfer", "transform", "translate", "uninstall", "use", "watermark", "write", "writeTo"];
type ActionType = (typeof actions)[number];
declare class Action extends ModelBasic {
    /**
     * Map storing action inclusions relationships
     * @private
     */
    private static inclusions;
    value: string;
    refinement?: Constraint[];
    includedIn: Action | null;
    implies?: Action[];
    /**
     * Creates an instance of Action.
     * @param {string} value - The value representing the action
     * @param {Action | null} includedIn - The parent action this action is included in
     */
    constructor(value: string, includedIn: Action | null);
    /**
     * Includes a set of values in the inclusions map for a given action
     * @param {string} current - The action to include other values in
     * @param {string[]} values - Array of values to be included in the action
     * @static
     */
    static includeIn(current: string, values: string[]): void;
    /**
     * Adds a constraint to the action's refinement array
     * @param {Constraint} constraint - The constraint to add
     */
    addConstraint(constraint: Constraint): void;
    /**
     * Checks if this action includes another action
     * @param {string} value - The action value to check for inclusion
     * @returns {Promise<boolean>} True if the action includes the value, false otherwise
     */
    includes(value: string): Promise<boolean>;
    /**
     * Gets all actions included in the given action values
     * @param {ActionType[]} values - Array of action types to get inclusions for
     * @returns {Promise<ActionType[]>} Array of included action types
     * @static
     */
    static getIncluded(values: ActionType[]): Promise<ActionType[]>;
    /**
     * Evaluates the action by checking refinements and state fetcher context
     * @returns {Promise<boolean>} True if the action evaluation succeeds, false otherwise
     */
    evaluate(): Promise<boolean>;
    /**
     * Refines the action by evaluating all its refinement constraints
     * @returns {Promise<boolean>} True if all refinements evaluate successfully, false otherwise
     */
    refine(): Promise<boolean>;
    /**
     * Verifies the action
     * @returns {Promise<boolean>} Always returns true
     */
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
    /**
     * Creates an instance of RuleDuty.
     * @param {Party | undefined} assigner - The party assigning the duty
     * @param {Party | undefined} assignee - The party to whom the duty is assigned
     */
    constructor(assigner?: Party, assignee?: Party);
    /**
     * Gets the array of consequence duties associated with this duty
     * @returns {RuleDuty[] | undefined} The array of consequence duties or undefined if none exist
     */
    getConsequence(): RuleDuty[] | undefined;
    /**
     * Evaluates the duty by checking its action and constraints
     * @returns {Promise<boolean>} True if the duty is fulfilled, false otherwise
     */
    evaluate(): Promise<boolean>;
    /**
     * Evaluates the consequences of the duty
     * @returns {Promise<boolean>} True if any consequence is fulfilled, false otherwise
     */
    private evaluateConsequences;
    /**
     * Evaluates the actions of the duty
     * @returns {Promise<boolean>} True if all actions are fulfilled, false otherwise
     */
    private evaluateActions;
    /**
     * Evaluates the constraints of the duty
     * @returns {Promise<boolean>} True if all constraints are fulfilled, false otherwise
     */
    private evaluateConstraints;
    /**
     * Verifies that the duty has valid properties
     * @returns {Promise<boolean>} True if the duty is valid, throws an error otherwise
     */
    verify(): Promise<boolean>;
    /**
     * Adds a consequence duty to this duty
     * @param {RuleDuty} duty - The consequence duty to add
     */
    addConsequence(duty: RuleDuty): void;
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
    /**
     * Gets the context containing state functions
     * @returns {StateFunctions} The state functions context
     */
    get context(): StateFunctions;
    /**
     * Gets the compensation state
     * @returns {Promise<boolean>} The compensation state
     * @protected
     */
    protected getCompensate(): Promise<boolean>;
}

declare class PolicyEvaluator {
    static instance: PolicyEvaluator;
    private policies;
    private readonly pickers;
    constructor();
    static getInstance(): PolicyEvaluator;
    /**
     * Filters and captures target explorables based on their unique identifiers.
     * @param explorable The explorable object to evaluate
     * @param options Optional configuration object that may contain target criteria
     * @returns boolean indicating if the explorable should be picked
     */
    private pickTarget;
    /**
     * Filters entities based on a specific option key and corresponding payload.
     * @param optionKey The key to check in the options object
     * @param explorable The explorable object to evaluate
     * @param options Configuration object containing filtering criteria
     * @returns boolean indicating if the entity should be picked
     */
    private pickEntityFor;
    /**
     * Filters duties emitted by a specific assigner.
     * @param explorable The explorable object to evaluate
     * @param options Optional configuration object that may contain assigner criteria
     * @returns boolean indicating if the duty should be picked
     */
    private pickEmittedDuty;
    /**
     * Filters duties assigned to a specific assignee.
     * @param explorable The explorable object to evaluate
     * @param options Optional configuration object that may contain assignee criteria
     * @returns boolean indicating if the duty should be picked
     */
    private pickAssignedDuty;
    /**
     * Filters permission rules.
     * @param explorable The explorable object to evaluate
     * @param options Optional configuration object for permission filtering
     * @returns boolean indicating if the permission should be picked
     */
    private pickPermission;
    /**
     * Filters prohibition rules.
     * @param explorable The explorable object to evaluate
     * @param options Optional configuration object for prohibition filtering
     * @returns boolean indicating if the prohibition should be picked
     */
    private pickProhibition;
    /**
     * Filters duties based on their type and configuration.
     * @param explorable The explorable object to evaluate
     * @param options Optional configuration object for duty filtering
     * @returns boolean indicating if the duty should be picked
     */
    private pickDuties;
    /**
     * Sets fetcher options for all policies.
     * @param options Configuration object to be set on the fetchers
     */
    private setFetcherOptions;
    /**
     * Generic picking function that applies the appropriate picker based on options.
     * @param explorable The explorable object to evaluate
     * @param options Configuration object determining which picker to use
     * @returns boolean indicating if the explorable should be picked
     */
    private pick;
    /**
     * Explores all policies and collects matching explorables based on picker criteria.
     * @param options Configuration object for exploration
     * @returns Promise resolving to array of matched explorables
     */
    private explore;
    /**
     * Creates a payload object for assignee-based duty filtering.
     * @param assignee The assignee identifier
     * @returns A DutyOptionPayload configured for assignee filtering
     * @private
     */
    private static getAssigneePayload;
    /**
     * Creates a payload object for assigner-based duty filtering.
     * @param assigner The assigner identifier
     * @returns A DutyOptionPayload configured for assigner filtering
     * @private
     */
    private static getAssignerPayload;
    /**
     * Traverses up the node hierarchy to find the first assigner UID.
     * @param node The starting node to search from
     * @returns The first found assigner UID or undefined if none found
     * @public
     */
    static findAssigner(node: any): string | undefined;
    /**
     * Clears all policies from the evaluator.
     * @public
     */
    cleanPolicies(): void;
    /**
     * Adds a policy to the evaluator with optional data and state fetchers.
     * @param policy The policy to add
     * @param dataFetcher Optional data fetcher to associate with the policy
     * @param stateFetcher Optional state fetcher to associate with the policy
     * @public
     */
    addPolicy(policy: Policy, dataFetcher?: PolicyDataFetcher, stateFetcher?: PolicyStateFetcher): void;
    /**
     * Replaces all existing policies with a single new policy.
     * @param policy The policy to set
     * @param dataFetcher Optional data fetcher to associate with the policy
     * @param stateFetcher Optional state fetcher to associate with the policy
     * @public
     */
    setPolicy(policy: Policy, dataFetcher?: PolicyDataFetcher, stateFetcher?: PolicyStateFetcher): void;
    /**
     * Debugs all policies in the evaluator by printing their structure.
     * @public
     */
    logPolicies(): void;
    /**
     * Checks if an entity with the given UID has failed evaluation.
     * @param uid The unique identifier to check
     * @returns Whether the entity has failed
     * @public
     */
    hasFailed(uid: string): boolean;
    /**
     * Retrieves all targets defined in the policies.
     * @returns {Promise<string[]>} A promise resolved with an array of target UIDs.
     */
    listTargets(): Promise<string[]>;
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
    isActionPerformable(actionType: ActionType, target: string, defaultResult?: boolean, resetFailures?: boolean): Promise<boolean>;
    /**
     * Evaluates the exploitability of listed resources within a set of policies.
     * @param {any} json - JSON representation of policies to be evaluated.
     * @param {boolean} [defaultResult=false] - The default result if no resources are found.
     * @returns {Promise<boolean>} Resolves with a boolean indicating whether the resources are exploitable.
     */
    evalResourcePerformabilities(json: any, defaultResult?: boolean): Promise<boolean>;
    /**
     * Retrieves all duties defined in the policies.
     * @returns {Promise<RuleDuty[]>} Promise resolved with array of duties
     */
    getDuties(): Promise<RuleDuty[]>;
    /**
     * Gets duties associated with a specific target.
     * @param {string} target - The target UID
     * @param {boolean} fulfilled - Whether to only return fulfilled duties (default: false)
     * @returns {Promise<RuleDuty[]>} Promise resolved with array of matching duties
     */
    getDutiesForTarget(target: string, fulfilled?: boolean): Promise<RuleDuty[]>;
    /**
     * Gets duties for a specific action and target combination.
     * @param {string} action - The action name
     * @param {string} target - The target UID
     * @param {boolean} fulfilled - Whether to only return fulfilled duties (default: false)
     * @returns {Promise<RuleDuty[]>} Promise resolved with array of matching duties
     */
    getDutiesFor(action: string, target: string, fulfilled?: boolean): Promise<RuleDuty[]>;
    /**
     * Retrieves duties assigned to a specific assignee.
     * @param {string} assignee - The assignee UID
     * @returns {Promise<RuleDuty[]>} Promise resolved with array of assigned duties
     */
    getAssignedDuties(assignee: string): Promise<RuleDuty[]>;
    /**
     * Retrieves duties emitted by a specific assigner.
     * @param {string} assigner - The assigner UID
     * @returns {Promise<RuleDuty[]>} Promise resolved with array of emitted duties
     */
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

declare class Namespace {
    uri: string;
    private instanciators;
    constructor(uri: string);
    addInstanciator(property: string, instanciator: InstanciatorFunction): void;
    instanciateProperty(property: string, element: any, parent: any, root: Policy | null, fromArray?: boolean): Extension | null;
}

type InstanciatorFunction = (node: any, parent: any, root: Policy | null, fromArray?: boolean) => any;
interface PolicyNamespace {
    parse: (data: any) => any;
}
declare class PolicyInstanciator {
    policy: Policy | null;
    static instance: PolicyInstanciator;
    static namespaces: Record<string, Namespace>;
    constructor();
    static getInstance(): PolicyInstanciator;
    private static readonly instanciators;
    /**
     * Sets a permission rule on the policy
     * @param {any} element - The permission element data
     * @param {Policy} parent - The parent policy
     * @param {Policy | null} root - The root policy
     * @returns {RulePermission} The created permission rule
     */
    private static setPermission;
    /**
     * Sets a prohibition rule on the policy
     * @param {any} element - The prohibition element data
     * @param {Policy} parent - The parent policy
     * @param {Policy | null} root - The root policy
     * @returns {RuleProhibition} The created prohibition rule
     */
    private static setProhibition;
    /**
     * Sets an obligation rule on the policy
     * @param {any} element - The obligation element data
     * @param {Policy} parent - The parent policy
     * @param {Policy | null} root - The root policy
     * @returns {RuleDuty} The created obligation rule
     */
    private static setObligation;
    /**
     * Sets a duty rule on a permission
     * @param {any} element - The duty element data
     * @param {RulePermission} parent - The parent permission
     * @param {Policy | null} root - The root policy
     * @returns {RuleDuty} The created duty rule
     */
    private static setDuty;
    /**
     * Sets an action on a rule
     * @param {string | any} element - The action element data
     * @param {Rule} parent - The parent rule
     * @param {Policy | null} root - The root policy
     * @param {boolean} [fromArray] - Whether the action comes from an array
     * @returns {Action} The created action
     */
    private static setAction;
    /**
     * Sets a target on a rule
     * @param {any} element - The target element data
     * @param {Rule} parent - The parent rule
     * @param {Policy | null} root - The root policy
     */
    private static setTarget;
    /**
     * Sets a constraint on a parent element
     * @param {any} element - The constraint element data
     * @param {LogicalConstraint | Rule | Action} parent - The parent element
     * @param {Policy | null} root - The root policy
     * @returns {Constraint} The created constraint
     */
    private static setConstraint;
    /**
     * Sets a refinement on an action
     * @param {any} element - The refinement element data
     * @param {Action} parent - The parent action
     * @param {Policy | null} root - The root policy
     * @returns {Constraint} The created refinement constraint
     */
    private static setRefinement;
    /**
     * Sets a remedy on a prohibition rule
     * @param {any} element - The remedy element data
     * @param {RuleProhibition} parent - The parent prohibition
     * @param {Policy | null} root - The root policy
     * @returns {RuleDuty} The created remedy rule
     */
    private static setRemedy;
    /**
     * Sets a consequence on a duty rule
     * @param {any} element - The consequence element data
     * @param {RuleDuty} parent - The parent duty
     * @param {Policy | null} root - The root policy
     * @returns {RuleDuty} The created consequence rule
     */
    private static setConsequence;
    /**
     * Selects and instantiates the appropriate policy type based on the input JSON
     * @param {any} json - The input policy JSON
     */
    private selectPolicyType;
    /**
     * Generates a policy from input JSON data
     * @param {any} json - The input policy JSON
     * @param {PolicyNamespace} [policyNamespace] - Optional policy namespace
     * @returns {Policy | null} The generated policy or null if generation fails
     */
    genPolicyFrom(json: any, policyNamespace?: PolicyNamespace): Policy | null;
    /**
     * Adds a namespace instantiator
     * @param {Namespace} namespace - The namespace to add
     */
    static addNamespaceInstanciator(namespace: Namespace): void;
    /**
     * Handles namespace attributes during policy traversal
     * @param {string} attribute - The attribute name
     * @param {any} element - The element data
     * @param {ModelBasic} parent - The parent model
     * @param {Policy | null} root - The root policy
     * @param {boolean} [fromArray] - Whether the element comes from an array
     * @returns {ModelBasic | null | unknown} The created model or null
     */
    private static handleNamespaceAttribute;
    /**
     * Traverses the policy tree and instantiates elements
     * @param {any} node - The current node
     * @param {any} parent - The parent node
     */
    traverse(node: any, parent: any): void;
    /**
     * Constructs a new instance of a type with namespace handling
     * @param {new (...args: any[]) => T} Type - The type constructor
     * @param {...any[]} args - Constructor arguments
     * @returns {T} The constructed instance
     */
    static construct<T>(Type: new (...args: any[]) => T, ...args: any[]): T;
}

declare const evaluator: PolicyEvaluator;
declare const instanciator: PolicyInstanciator;

export { type ActionType, Custom, PolicyDataFetcher, PolicyEvaluator, PolicyInstanciator, PolicyStateFetcher, evaluator, instanciator };
