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
import { CopyMode, copy, getLastTerm } from './utils';

type InstanciatorFunction = (node: any, parent: any) => any;

export class PolicyInstanciator {
  public policy: Policy | null;
  public static instance: PolicyInstanciator;

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
    };

  private static setPermission(element: any, parent: Policy): RulePermission {
    const rule = new RulePermission();
    rule.setParent(parent);
    parent.addPermission(rule);
    return rule;
  }

  private static setProhibition(element: any, parent: Policy): RuleProhibition {
    const rule = new RuleProhibition();
    rule.setParent(parent);
    parent.addProhibition(rule);
    return rule;
  }

  private static setObligation(element: any, parent: Policy): RuleDuty {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    rule.setParent(parent);
    parent.addDuty(rule);
    return rule;
  }

  private static setDuty(element: any, parent: RulePermission) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    rule.setParent(parent);
    parent.addDuty(rule);
    return rule;
  }

  private static setAction(element: string | any, parent: Rule): Action {
    try {
      const value = getLastTerm(
        typeof element === 'object' ? element.value : element,
      );
      if (!value) {
        throw new Error('Invalid action');
      }
      const action = new Action(value, null);
      action.setParent(parent);
      parent.setAction(action);
      return action;
    } catch (error: any) {
      throw new Error('Action is undefined');
    }
  }

  private static setTarget(element: any, parent: Rule): void {
    const asset = new Asset(element);
    asset.setParent(parent);
    parent.setTarget(asset);
  }

  private static setConstraint(
    element: any,
    parent: LogicalConstraint | Rule | Action,
  ): Constraint {
    const {
      leftOperand,
      operator: _operator,
      rightOperand,
      constraint: constraints,
    } = element;
    const operator = _operator && getLastTerm(_operator);
    const constraint: Constraint =
      (leftOperand &&
        operator &&
        rightOperand !== undefined &&
        new AtomicConstraint(
          new LeftOperand(leftOperand),
          new Operator(operator),
          new RightOperand(rightOperand),
        )) ||
      (operator &&
        Array.isArray(constraints) &&
        constraints.length > 0 &&
        new LogicalConstraint(operator));
    copy(
      constraint,
      element,
      ['constraint', 'leftOperand', 'operator', 'rightOperand'],
      CopyMode.exclude,
    );
    if (constraint) {
      constraint.setParent(parent);
    }
    parent.addConstraint(constraint || element);
    return constraint;
  }

  private static setRefinement(element: any, parent: Action): Constraint {
    return PolicyInstanciator.setConstraint(element, parent);
  }

  private static setConsequence(element: any, parent: RuleDuty): RuleDuty {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    copy(
      rule,
      element,
      ['compensatedParty', 'compensatingParty'],
      CopyMode.include,
    );
    rule.setParent(parent);
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
        this.policy = new PolicyAgreement(json.uid, context);
        break;
      default:
        throw new Error(`Unknown policy type: ${json['@type']}`);
    }
  }

  public genPolicyFrom(json: any): Policy | null {
    try {
      this.selectPolicyType(json);
      this.traverse(json, this.policy);
      return this.policy;
    } catch (error: any) {
      console.error(error.message);
    }
    return null;
  }

  public traverse(node: any, parent: any): void {
    const instanciate = (property: string, element: any) => {
      try {
        if (element) {
          const child: any =
            PolicyInstanciator.instanciators[property] &&
            PolicyInstanciator.instanciators[property](element, parent);
          if (typeof element === 'object') {
            if (child) {
              this.traverse(element, child);
            } else {
              console.warn(`Traversal stopped for "${property}".`);
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
          instanciate(property, item);
        });
      } else {
        instanciate(property, element);
      }
    }
  }
}

export default PolicyInstanciator.getInstance();
