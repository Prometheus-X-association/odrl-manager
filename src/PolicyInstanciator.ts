import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
import { Policy } from 'models/Policy';
import { PolicyAgreement } from 'models/PolicyAgreement';
import { PolicyOffer } from 'models/PolicyOffer';
import { PolicySet } from 'models/PolicySet';
import { Rule } from 'models/Rule';
import { RulePermission } from 'models/RulePermission';

export class PolicyInstanciator {
  public policy: Policy | null;
  public static instance: PolicyInstanciator;

  constructor() {
    this.policy = null;
  }
  //
  private static instanciators: any = {
    permission: (node: any, parent: Policy): RulePermission => {
      const rule = new RulePermission();
      parent.addPermission(rule);
      return rule;
    },
    prohibition: (node: any) => {},
    obligation: (node: any) => {},
    action: (node: any, parent: Rule): Action => {
      const action = new Action(node.action, null);
      parent.setAction(action);
      return action;
    },
    target: (node: any, parent: Rule) => {
      const asset = new Asset(node.target);
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
    for (const property in node) {
      if (node.hasOwnProperty(property)) {
        const value = node[property];
        if (typeof value === 'object' && value !== null) {
          if (PolicyInstanciator.instanciators[property]) {
            const child: any = PolicyInstanciator.instanciators[property](
              value,
              parent,
            );
            this.traverse(value, child);
          } else {
            console.warn(
              `Warning: No function associated with property "${property}"`,
            );
          }
        } else {
          console.log(`Log: The current value is "${value}"`);
        }
      }
    }
  }
}
