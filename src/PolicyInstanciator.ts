import { ModelBasic } from 'models/ModelBasic';
import { Action, actions } from './models/odrl/Action';
import { Asset } from './models/odrl/Asset';
import { AtomicConstraint } from './models/odrl/AtomicConstraint';
import { Constraint } from './models/odrl/Constraint';
import { LeftOperand } from './models/odrl/LeftOperand';
import { LogicalConstraint } from './models/odrl/LogicalConstraint';
import { Operator } from './models/odrl/Operator';
import { Policy } from './models/odrl/Policy';
import { PolicyAgreement } from './models/odrl/PolicyAgreement';
import { PolicyOffer } from './models/odrl/PolicyOffer';
import { PolicySet } from './models/odrl/PolicySet';
import { RightOperand } from './models/odrl/RightOperand';
import { Rule } from './models/odrl/Rule';
import { RuleDuty } from './models/odrl/RuleDuty';
import { RulePermission } from './models/odrl/RulePermission';
import { RuleProhibition } from './models/odrl/RuleProhibition';
import {
  CopyMode,
  copy,
  getDurationMatching,
  getLastTerm,
  parseISODuration,
} from './utils';
import { Party } from 'models/odrl/Party';
import { Namespace } from 'Namespace';

export type InstanciatorFunction = (
  node: any,
  parent: any,
  root: Policy | null,
  fromArray?: boolean,
) => any;

export interface PolicyNamespace {
  parse: (data: any) => any;
}

export class PolicyInstanciator {
  public policy: Policy | null;
  public static instance: PolicyInstanciator;
  public static namespaces: Record<string, Namespace> = {};

  constructor() {
    this.policy = null;
    Action.includeIn('use', [
      'Attribution',
      'CommericalUse',
      'DerivativeWorks',
      'Distribution',
      'Notice',
      'Reproduction',
      'ShareAlike',
      'Sharing',
      'SourceCode',
      'acceptTracking',
      'aggregate',
      'annotate',
      'anonymize',
      'archive',
      'attribute',
      'compensate',
      'concurrentUse',
      'delete',
      'derive',
      'digitize',
      'distribute',
      'ensureExclusivity',
      'execute',
      'grantUse',
      'include',
      'index',
      'inform',
      'install',
      'modify',
      'move',
      'nextPolicy',
      'obtainConsent',
      'play',
      'present',
      'print',
      'read',
      'reproduce',
      'reviewPolicy',
      'stream',
      'synchronize',
      'textToSpeech',
      'transform',
      'translate',
      'uninstall',
      'watermark',
    ]);
    Action.includeIn('play', ['display']);
    Action.includeIn('extract', ['reproduce']);
    Action.includeIn('transfer', ['give', 'sell']);
  }

  public static getInstance(): PolicyInstanciator {
    if (!PolicyInstanciator.instance) {
      PolicyInstanciator.instance = new PolicyInstanciator();
    }
    return PolicyInstanciator.instance;
  }

  private static readonly instanciators: Record<string, InstanciatorFunction> =
    {
      permission: PolicyInstanciator.setPermission,
      prohibition: PolicyInstanciator.setProhibition,
      obligation: PolicyInstanciator.setObligation,
      duty: PolicyInstanciator.setDuty,
      action: PolicyInstanciator.setAction,
      target: PolicyInstanciator.setTarget,
      constraint: PolicyInstanciator.setConstraint,
      refinement: PolicyInstanciator.setRefinement,
      consequence: PolicyInstanciator.setConsequence,
      remedy: PolicyInstanciator.setRemedy,
    };

  private static setPermission(
    element: any,
    parent: Policy,
    root: Policy | null,
  ): RulePermission {
    const { assigner, assignee } = element;
    const rule = new RulePermission();
    if (assigner) rule.assigner = new Party(assigner);
    if (assignee) rule.assignee = new Party(assignee);
    rule.setParent(parent);
    parent.addPermission(rule);
    return rule;
  }

  private static setProhibition(
    element: any,
    parent: Policy,
    root: Policy | null,
  ): RuleProhibition {
    const { assigner, assignee } = element;
    const rule = new RuleProhibition();
    if (assigner) rule.assigner = new Party(assigner);
    if (assignee) rule.assignee = new Party(assignee);
    rule.setParent(parent);
    parent.addProhibition(rule);
    return rule;
  }

  private static setObligation(
    element: any,
    parent: Policy,
    root: Policy | null,
  ): RuleDuty {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(
      assigner && new Party(assigner),
      assignee && new Party(assignee),
    );
    rule.setParent(parent);
    rule._type = 'obligation';
    parent.addDuty(rule);
    return rule;
  }

  private static setDuty(
    element: any,
    parent: RulePermission,
    root: Policy | null,
  ) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(
      assigner && new Party(assigner),
      assignee && new Party(assignee),
    );
    rule.setParent(parent);
    rule._type = 'duty';
    parent.addDuty(rule);
    return rule;
  }

  private static setAction(
    element: string | any,
    parent: Rule,
    root: Policy | null,
    fromArray?: boolean,
  ): Action {
    try {
      const value = getLastTerm(
        typeof element === 'object' ? element.value : element,
      );
      if (!value) {
        throw new Error('Invalid action');
      }
      // const action = new Action(value, null);
      const action = PolicyInstanciator.construct(Action, value, null);
      action._rootUID = root?._objectUID;
      action.setParent(parent);
      if (!fromArray) {
        parent.setAction(action);
      } else {
        parent.addAction(action);
      }
      return action;
    } catch (error: any) {
      throw new Error('Action is undefined');
    }
  }

  private static setTarget(
    element: any,
    parent: Rule,
    root: Policy | null,
  ): void {
    const asset = new Asset(element);
    asset.setParent(parent);
    parent.setTarget(asset);
  }

  private static setConstraint(
    element: any,
    parent: LogicalConstraint | Rule | Action,
    root: Policy | null,
  ): Constraint {
    const {
      leftOperand,
      operator: _operator,
      rightOperand,
      constraint: constraints,
    } = element;

    let _rightOperand = rightOperand;
    const match = getDurationMatching(rightOperand);
    if (match) {
      // && todo
      _rightOperand = parseISODuration(rightOperand);
    }
    const operator = _operator && getLastTerm(_operator);

    const constraint: Constraint =
      (leftOperand &&
        operator &&
        _rightOperand !== undefined &&
        (() => {
          const _leftOperand = new LeftOperand(leftOperand);
          _leftOperand._rootUID = root?._objectUID;
          const constraint = new AtomicConstraint(
            _leftOperand,
            new Operator(operator),
            PolicyInstanciator.construct(RightOperand, _rightOperand),
          );
          _leftOperand.setParent(constraint);
          return constraint;
        })()) ??
      (operator &&
        Array.isArray(constraints) &&
        constraints.length > 0 &&
        new LogicalConstraint(operator));
    copy(
      constraint,
      element,
      [
        'constraint',
        'leftOperand',
        'operator',
        'rightOperand',
        '/^[^:]+:[^:]+$/',
      ],
      CopyMode.exclude,
    );
    if (constraint) {
      constraint.setParent(parent);
    }
    parent.addConstraint(constraint || element);
    return constraint;
  }

  private static setRefinement(
    element: any,
    parent: Action,
    root: Policy | null,
  ): Constraint {
    return PolicyInstanciator.setConstraint(element, parent, root);
  }

  private static setRemedy(
    element: any,
    parent: RuleProhibition,
    root: Policy | null,
  ): RuleDuty {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(
      assigner && new Party(assigner),
      assignee && new Party(assignee),
    );
    rule.setParent(parent);
    rule._type = 'remedy';
    parent.addRemedy(rule);
    return rule;
  }

  private static setConsequence(
    element: any,
    parent: RuleDuty,
    root: Policy | null,
  ): RuleDuty {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(
      assigner && new Party(assigner),
      assignee && new Party(assignee),
    );
    copy(
      rule,
      element,
      ['compensatedParty', 'compensatingParty'],
      CopyMode.include,
    );
    rule.setParent(parent);
    rule._type = 'consequence';
    parent.addConsequence(rule);
    return rule;
  }

  private selectPolicyType(json: any): void {
    const context = json['@context'];
    switch (json['@type']) {
      case 'Offer':
        this.policy = new PolicyOffer(json.uid, context);
        break;
      case 'Set':
        this.policy = new PolicySet(json.uid, context);
        break;
      case 'Agreement':
        const policy = new PolicyAgreement(json.uid, context);
        policy.setAssignee(json.assignee && new Party(json.assignee));
        policy.setAssigner(json.assigner && new Party(json.assigner));
        this.policy = policy;
        break;
      default:
        throw new Error(`Unknown policy type: ${json['@type']}`);
    }
  }

  public genPolicyFrom(
    json: any,
    policyNamespace?: PolicyNamespace,
  ): Policy | null {
    try {
      if (!json) {
        throw new Error('Input JSON is required');
      }
      const parsedJson = policyNamespace ? policyNamespace.parse(json) : json;
      this.selectPolicyType(parsedJson);
      this.traverse(parsedJson, this.policy);
      return this.policy;
    } catch (error) {
      console.error(
        'Error generating policy:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      return null;
    }
  }

  public static addNamespaceInstanciator(namespace: Namespace): void {
    this.namespaces[namespace.uri] = namespace;
  }

  private static handleNamespaceAttribute(
    attribute: string,
    element: any,
    parent: ModelBasic,
    root: Policy | null,
    fromArray: boolean = false,
  ): ModelBasic | null | unknown {
    const context = this.instance?.policy?.['@context'];
    const isContextArray = Array.isArray(context);

    if (
      isContextArray &&
      typeof attribute === 'string' &&
      /^[\w-]+:[\w-]+$/.test(attribute)
    ) {
      const [prefix, attr] = attribute.split(':');
      const ctx = context.find((c) => c[prefix]);

      if (ctx) {
        const namespaceUri = ctx[prefix];
        const namespace = this.namespaces[namespaceUri];
        if (namespace) {
          const ext = namespace.instanciateProperty(
            attr,
            element,
            parent,
            root,
            fromArray,
          );
          if (ext) {
            parent.addExtension(ext);
          }
          return ext;
        }
      }
    }
    return null;
  }

  public traverse(node: any, parent: any): void {
    const instanciate = (
      property: string,
      element: any,
      fromArray: boolean = false,
    ) => {
      try {
        if (element) {
          const child: ModelBasic =
            PolicyInstanciator.handleNamespaceAttribute(
              property,
              element,
              parent,
              this.policy,
              fromArray,
            ) ||
            (PolicyInstanciator.instanciators[property] &&
              ((PolicyInstanciator.instanciators[property].length == 4 &&
                PolicyInstanciator.instanciators[property](
                  element,
                  parent,
                  this.policy,
                  fromArray,
                )) ||
                PolicyInstanciator.instanciators[property](
                  element,
                  parent,
                  this.policy,
                )));
          if (typeof element === 'object') {
            if (child) {
              this.traverse(element, child);
            } else if (property !== '@context') {
              console.warn(
                `\x1b[93m/!\\Traversal stopped for "${property}".\x1b[37m`,
              );
            }
          }
        }
      } catch (error: any) {
        console.error(error.message);
      }
    };
    for (const property in node) {
      const element = node[property];
      if (Array.isArray(element)) {
        element.forEach((item: any) => {
          instanciate(property, item, true);
        });
      } else {
        instanciate(property, element);
      }
    }
  }

  public static construct<T>(
    Type: new (...args: any[]) => T,
    ...args: any[]
  ): T {
    const context = this.instance?.policy?.['@context'];
    const isContextArray = Array.isArray(context);
    if (!isContextArray) {
      return Reflect.construct(Type, args);
    }
    const _namespace: string[] = [];
    args = args.map((arg) => {
      if (typeof arg === 'string' && /^[\w-]+:[\w-]+$/.test(arg)) {
        const [prefix, value] = arg.split(':');
        const ctx = context.find((c) => c[prefix]);
        if (ctx) {
          _namespace.push(prefix);
          return value;
        }
      }
      return arg;
    });
    const instance = Reflect.construct(Type, args);
    (instance as { _namespace: string | string[] })._namespace = _namespace;
    return instance;
  }
}

export default PolicyInstanciator.getInstance();
