import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { AtomicConstraint } from 'models/AtomicConstraint';
import { Constraint } from 'models/Constraint';
import { LogicalConstraint } from 'models/LogicalConstraint';
import { Policy } from 'models/Policy';
import { PolicyAgreement } from 'models/PolicyAgreement';
import { PolicyOffer } from 'models/PolicyOffer';
import { PolicySet } from 'models/PolicySet';
import { Rule } from 'models/Rule';
import { RulePermission } from 'models/RulePermission';

type InstanciatorFunction = (node: any, parent: any) => any;

export class PolicyInstanciator {
  public policy: Policy | null;
  public static instance: PolicyInstanciator;

  constructor() {
    this.policy = null;
  }
  //
  private static readonly instanciators: Record<string, InstanciatorFunction> =
    {
      permission: (element: any, parent: Policy): RulePermission => {
        const rule = new RulePermission();
        parent.addPermission(rule);
        return rule;
      },
      prohibition: (element: any, parent: Policy) => {},
      obligation: (element: any, parent: Policy) => {},
      action: (element: any, parent: Rule): Action => {
        const action = new Action(element, null);
        parent.setAction(action);
        return action;
      },
      target: (element: any, parent: Rule) => {
        const asset = new Asset(element);
        parent.setTarget(asset);
      },
      constraint: (element: any, parent: Rule) => {
        const {
          leftOperand,
          operator,
          rightOperand,
          constraint: constraints,
        } = element;
        const constraint: Constraint =
          (leftOperand &&
            operator &&
            rightOperand &&
            new AtomicConstraint(leftOperand, operator, rightOperand)) ||
          (operator &&
            Array.isArray(constraints) &&
            constraints.length > 0 &&
            new LogicalConstraint(operator, constraints));
        parent.addConstraint(constraint);
        return constraint;
      },
    };
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
  //
  public traverse(node: any, parent: any): void {
    const instanciate = (property: string, element: any) => {
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
