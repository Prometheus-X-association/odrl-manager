import { Constraint } from 'models/Constraint';
import { Operator } from './Operator';

export class LogicalConstraint extends Constraint {
  static readonly operands = ['and', 'andSequence', 'or', 'xone'];
  private constraint: Constraint[];
  private operand?: string;
  constructor(operand: String) {
    super(null, null, null);
    this.constraint = [];
  }
  public addConstraint(constraint: Constraint) {
    this.constraint.push(constraint);
  }
  // Todo
  async evaluate(): Promise<boolean> {
    switch (this.operand) {
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

  public async verify(): Promise<boolean> {
    const isValid =
      (await super.verify()) &&
      this.operand &&
      Object.values(LogicalConstraint.operands).includes(this.operand);

    if (!isValid) {
      throw new Error('LogicalConstraint propertie invalid');
    }
    return isValid;
  }
}
