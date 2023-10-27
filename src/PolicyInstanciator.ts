import { Policy } from 'models/Policy';
import { PolicyOffer } from 'models/PolicyOffer';
import { PolicySet } from 'models/PolicySet';
import { PolicyAgreement } from 'models/PolicyAgreement';
import { RulePermission } from 'models/RulePermission';
import { Action } from 'models/Action';
import { Asset } from 'models/Asset';
// import { Party } from 'models/Party';
import { Constraint } from 'models/Constraint';
import { LogicalConstraint } from 'models/LogicalConstraint';
import { LeftOperand } from 'models/LeftOperand';
import { Operator } from 'models/Operator';
import { RightOperand } from 'models/RightOperand';
import { AtomicConstraint } from 'models/AtomicConstraint';

export const parseODRL = (json: any): Policy => {
  let policyInstance: Policy;
  policyInstance = selectPolicyType(json);
  if (json.permission && Array.isArray(json.permission)) {
    json.permission.forEach((permission: any) => {
      const rulePermission = parsePermission(permission);
      policyInstance.addPermission(rulePermission);
    });
  }

  /*
  if (json.assigner) {
    policyInstance.assigner = new Party(json.assigner);
  }

  if (json.assignee) {
    policyInstance.assignee = new Party(json.assignee);
  }
  */
  return policyInstance;
};

const selectPolicyType = (json: any): Policy => {
  const context = json['@context'];
  switch (json['@type']) {
    case 'Offer':
      return new PolicyOffer(json.uid, context);
    case 'Set':
      return new PolicySet(json.uid, context);
    case 'Agreement':
      return new PolicyAgreement(json.uid, context);
    default:
      throw new Error(`Unknown policy type: ${json['@type']}`);
  }
};

const parsePermission = (permission: any): RulePermission => {
  const action = new Action(permission.action, null);
  const target = new Asset(permission.target);
  const rulePermission = new RulePermission(action, target);
  if (permission.constraint && Array.isArray(permission.constraint)) {
    permission.constraint.forEach((constraint: any) => {
      const parsedConstraint = parseConstraint(constraint);
      rulePermission.constraints = rulePermission.constraints || [];
      rulePermission.constraints.push(parsedConstraint);
    });
  }
  return rulePermission;
};

const parseConstraint = (constraint: any): LogicalConstraint | Constraint => {
  if (constraint.operator && constraint.constraint) {
    const logicalConstraint = new LogicalConstraint(constraint.operator, []);
    constraint.constraint.forEach((innerConstraint: any) => {
      const parsedInnerConstraint = parseConstraint(innerConstraint);
      logicalConstraint.constraints.push(parsedInnerConstraint);
    });
    return logicalConstraint;
  } else {
    return new AtomicConstraint(
      new LeftOperand(constraint.leftOperand),
      new Operator(constraint.operator),
      new RightOperand(constraint.rightOperand),
    );
  }
};
