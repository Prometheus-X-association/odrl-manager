declare abstract class PolicyValidator {
    protected abstract verify(): Promise<boolean>;
    protected validate(depth: number | undefined, validations: Promise<boolean>[]): void;
    debug(depth?: number): void;
}

declare abstract class PolicyExplorer extends PolicyValidator {
    protected abstract visit(): Promise<boolean>;
    protected explore(depth: number | undefined, evaluators: Promise<boolean>[]): void;
}

declare class ConflictTerm extends PolicyValidator {
    verify(): Promise<boolean>;
}

declare class Party extends PolicyValidator {
    verify(): Promise<boolean>;
}

declare class LeftOperand extends PolicyValidator {
    private value;
    constructor(value: string);
    getValue(): string;
    visit(): Promise<string | number | null>;
    verify(): Promise<boolean>;
}

declare class Operator extends PolicyValidator {
    static readonly EQ: string;
    static readonly NEQ: string;
    static readonly GT: string;
    static readonly GEQ: string;
    static readonly LT: string;
    static readonly LEQ: string;
    static readonly IN: string;
    static readonly HAS_PART: string;
    static readonly IS_A: string;
    static readonly IS_ALL_OF: string;
    static readonly IS_ANY_OF: string;
    static readonly IS_NONE_OF: string;
    value: string;
    constructor(value: string);
    verify(): Promise<boolean>;
}

declare class RightOperand extends PolicyValidator {
    value: string | number;
    constructor(value: string | number);
    verify(): Promise<boolean>;
}

declare abstract class Constraint extends PolicyValidator {
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
    visit(): Promise<boolean>;
    protected verify(): Promise<boolean>;
}

declare class Action extends PolicyValidator {
    value: string;
    refinement?: Constraint[];
    includedIn: Action | null;
    implies?: Action[];
    constructor(value: string, includedIn: Action | null);
    addConstraint(constraint: Constraint): void;
    verify(): Promise<boolean>;
}

declare class AssetCollection extends Asset {
    source?: string;
    refinement?: Constraint[];
}

declare class Asset extends PolicyValidator {
    uid?: string;
    partOf?: AssetCollection[];
    hasPolicy?: string;
    constructor(target: string | {
        uid?: string;
        partOf?: AssetCollection[];
        hasPolicy?: string;
    });
    verify(): Promise<boolean>;
}

declare enum RelationType {
    TARGET = "target"
}
declare class Relation extends PolicyValidator {
    type: RelationType;
    asset: Asset;
    constructor(type: RelationType, asset: Asset);
    verify(): Promise<boolean>;
}

declare abstract class Rule extends PolicyExplorer {
    action?: Action | Action[];
    target?: Asset;
    assigner?: Party;
    assignee?: Party;
    asset?: Asset;
    parties?: Party[];
    failures?: Rule[];
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
    protected visit(): Promise<boolean>;
}

declare class RuleDuty extends Rule {
    private consequence?;
    compensatedParty?: string;
    compensatingParty?: string;
    constructor(assigner?: Party, assignee?: Party);
    visit(): Promise<boolean>;
    verify(): Promise<boolean>;
    addConsequence(consequence: RuleDuty): void;
}

declare class RulePermission extends Rule {
    duty?: RuleDuty[];
    constructor();
    addDuty(duty: RuleDuty): void;
    visit(): Promise<boolean>;
    verify(): Promise<boolean>;
}

declare class RuleProhibition extends Rule {
    remedy?: RuleDuty[];
    constructor();
    visit(): Promise<boolean>;
    verify(): Promise<boolean>;
}

declare abstract class Policy extends PolicyExplorer {
    protected '@context': string;
    protected '@type': string;
    protected uid: string;
    protected permission: RulePermission[];
    protected prohibition: RuleProhibition[];
    protected obligation: RuleDuty[];
    protected profile?: string[];
    protected inheritFrom?: string[];
    protected conflict?: ConflictTerm[];
    constructor(uid: string, context: string, type: string);
    get permissions(): RulePermission[];
    get prohibitions(): RuleProhibition[];
    get obligations(): RulePermission[];
    addPermission(permission: RulePermission): void;
    addProhibition(prohibition: RuleProhibition): void;
    addDuty(prohibition: RuleDuty): void;
    launchValidation(): Promise<boolean>;
}

declare class PolicyEvaluator {
    static instance: PolicyEvaluator;
    constructor();
    static getInstance(): PolicyEvaluator;
    setPolicy(policy: Policy): void;
    setDataContext(data: any): void;
    visitTarget(target: string): Promise<void>;
}

declare class PolicyInstanciator {
    policy: Policy | null;
    static instance: PolicyInstanciator;
    constructor();
    static getInstance(): PolicyInstanciator;
    private static readonly instanciators;
    private static permission;
    private static prohibition;
    private static obligation;
    private static duty;
    private static action;
    private static target;
    private static constraint;
    private static refinement;
    private static consequence;
    private selectPolicyType;
    genPolicyFrom(json: any): Policy | null;
    traverse(node: any, parent: any): void;
}

declare const evaluator: PolicyEvaluator;
declare const instanciator: PolicyInstanciator;

export { evaluator, instanciator };
