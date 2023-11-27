import { Constraint } from 'models/Constraint';
import { Operator } from './Operator';

export class LogicalConstraint extends Constraint {
  constraints: Constraint[];
  constructor(operator: Operator) {
    super(null, operator, null);
    this.constraints = [];
  }
  public addConstraint(constraint: Constraint) {
    this.constraints.push(constraint);
  }
  async evaluate(): Promise<boolean> {
    switch (this.operator.value) {
      case 'and':
        return (
          await Promise.all(
            this.constraints.map((constraint) => constraint.evaluate()),
          )
        ).every((result) => result);
      case 'or':
        return (
          await Promise.all(
            this.constraints.map((constraint) => constraint.evaluate()),
          )
        ).some((result) => result);
      default:
        return false;
    }
  }
}
