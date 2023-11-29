import { Constraint } from 'models/Constraint';
import { Operator } from './Operator';

export class LogicalConstraint extends Constraint {
  private constraint: Constraint[];
  constructor(operator: Operator) {
    super(null, operator, null);
    this.constraint = [];
  }
  public addConstraint(constraint: Constraint) {
    this.constraint.push(constraint);
  }
  // Todo
  async evaluate(): Promise<boolean> {
    switch (this.operator.value) {
      case 'and':
        return (
          await Promise.all(
            this.constraint.map((constraint) => constraint.evaluate()),
          )
        ).every((result) => result);
      case 'or':
        return (
          await Promise.all(
            this.constraint.map((constraint) => constraint.evaluate()),
          )
        ).some((result) => result);
      default:
        return false;
    }
  }
}
