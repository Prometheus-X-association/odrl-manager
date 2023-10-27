import { Action } from 'models/Action';
import { Policy } from 'models/Policy';
import { Rule } from 'models/Rule';
import { RulePermission } from 'models/RulePermission';
// tmp
export class PolicyEvaluator {
  // private static instance: PolicyEvaluator;

  private ruleFailures: Rule[];
  private permissionFunctions: Record<string, Function> = {};
  constructor() {
    this.ruleFailures = [];
    this.permissionFunctions = {};
  }
  /*
  public static getInstance(): PolicyEvaluator {
    if (!PolicyEvaluator.instance) {
      PolicyEvaluator.instance = new PolicyEvaluator();
    }
    return PolicyEvaluator.instance;
  }
  */

  public visitPolicy(policy: Policy) {
    policy.permissions.forEach((permission) => {
      this.visitPermission(permission);
    });
    // policy.prohibitions.forEach((prohibition) => {});
    // policy.obligations.forEach((duty) => {});
    return this.ruleFailures.length === 0;
  }

  private visitPermission(permission: RulePermission) {
    const constraints = permission.getConstraints();
    constraints.every((constraint) => {
      const key = constraint.leftOperand?.getValue();
      if (key) {
        const f: Function =
          this.permissionFunctions[key] || ((operator: string) => false);
        const evaluation = f(constraint.dataType);
        // f(permission);
        if (!evaluation) {
          this.ruleFailures.push(permission);
          return false;
        }
      }
      return true;
    });
  }
}

// export default PolicyEvaluator.getInstance();
