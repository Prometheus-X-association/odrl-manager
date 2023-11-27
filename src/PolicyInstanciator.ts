import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
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
    const instanciate = (property: string, value: any): any => {
      if (PolicyInstanciator.instanciators[property]) {
        return PolicyInstanciator.instanciators[property](value, parent);
      } else {
        console.warn(`No function associated with property "${property}"`);
        return null;
      }
    };

    for (const property in node) {
      const value = node[property];
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const element = value[i];
          if (element) {
            const child: any = instanciate(property, element);
            if (child !== null && typeof element === 'object') {
              this.traverse(element, child);
            } else {
              console.warn(`Traversal stopped for property "${property}"`);
            }
          }
        }
      } else if (value) {
        const child: any = instanciate(property, value);
        if (child !== null && typeof value === 'object') {
          this.traverse(value, child);
        } else {
          console.warn(`Traversal stopped for property "${property}"`);
        }
      } else {
        console.warn(`The current value is "${value}"`);
      }
    }
  }
}
