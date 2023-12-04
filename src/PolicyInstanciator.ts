import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { AtomicConstraint } from 'models/AtomicConstraint';
import { Constraint } from 'models/Constraint';
import { LeftOperand } from 'models/LeftOperand';
import { LogicalConstraint } from 'models/LogicalConstraint';
import { Operator } from 'models/Operator';
import { Policy } from 'models/Policy';
import { PolicyAgreement } from 'models/PolicyAgreement';
import { PolicyOffer } from 'models/PolicyOffer';
import { PolicySet } from 'models/PolicySet';
import { RightOperand } from 'models/RightOperand';
import { Rule } from 'models/Rule';
import { RuleDuty } from 'models/RuleDuty';
import { RulePermission } from 'models/RulePermission';
import { RuleProhibition } from 'models/RuleProhibition';
import { CopyMode, copy } from 'utils';

type InstanciatorFunction = (node: any, parent: any) => any;

class PolicyInstanciator {
  public policy: Policy | null;
  public static instance: PolicyInstanciator;

  constructor() {
    this.policy = null;
  }

  public static getInstance(): PolicyInstanciator {
    if (!PolicyInstanciator.instance) {
      PolicyInstanciator.instance = new PolicyInstanciator();
    }
    return PolicyInstanciator.instance;
  }

  private static readonly instanciators: Record<string, InstanciatorFunction> =
    {
      permission: PolicyInstanciator.permission,
      prohibition: PolicyInstanciator.prohibition,
      obligation: PolicyInstanciator.obligation,
      duty: PolicyInstanciator.duty,
      action: PolicyInstanciator.action,
      target: PolicyInstanciator.target,
      constraint: PolicyInstanciator.constraint,
      refinement: PolicyInstanciator.refinement,
      consequence: PolicyInstanciator.consequence,
    };

  private static permission(element: any, parent: Policy): RulePermission {
    const rule = new RulePermission();
    parent.addPermission(rule);
    return rule;
  }

  private static prohibition(element: any, parent: Policy): RuleProhibition {
    const rule = new RuleProhibition();
    parent.addProhibition(rule);
    return rule;
  }

  private static obligation(element: any, parent: Policy): RuleDuty {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    parent.addDuty(rule);
    return rule;
  }

  private static duty(element: any, parent: RulePermission) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    parent.addDuty(rule);
    return rule;
  }

  private static action(element: string | any, parent: Rule): Action {
    if (typeof element === 'object') {
      const action = new Action(element.value, null);
      parent.addAction(action);
      return action;
    }
    const action = new Action(element, null);
    parent.setAction(action);
    return action;
  }

  private static target(element: any, parent: Rule): void {
    const asset = new Asset(element);
    parent.setTarget(asset);
  }

  private static constraint(
    element: any,
    parent: LogicalConstraint | Rule | Action,
  ): Constraint {
    const {
      leftOperand,
      operator,
      rightOperand,
      constraint: constraints,
    } = element;
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
    parent.addConstraint(constraint || element);
    return constraint;
  }

  private static refinement(element: any, parent: Action): Constraint {
    return PolicyInstanciator.constraint(element, parent);
  }

  private static consequence(element: any, parent: RuleDuty): RuleDuty {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    copy(
      rule,
      element,
      ['compensatedParty', 'compensatingParty'],
      CopyMode.include,
    );
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
    this.selectPolicyType(json);
    this.traverse(json, this.policy);
    return this.policy;
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
