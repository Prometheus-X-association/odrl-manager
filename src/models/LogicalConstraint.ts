import { Constraint } from 'models/Constraint';
import { Operator } from './Operator';

export class LogicalConstraint extends Constraint {
  static readonly operands: string[] = ['and', 'andSequence', 'or', 'xone'];
  private constraint: Constraint[];
  private operand?: string;
  constructor(operand: string) {
    super(null, null, null);
    this.operand = operand;
    this.constraint = [];
  }
  public addConstraint(constraint: Constraint) {
    this.constraint.push(constraint);
  }
  // Todo
  async visit(): Promise<boolean> {
    switch (this.operand) {
      case 'and':
        return (
          await Promise.all(
            this.constraint.map((constraint) => constraint.visit()),
          )
        ).every((result) => result);
      case 'or':
        return (
          await Promise.all(
            this.constraint.map((constraint) => constraint.visit()),
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
      LogicalConstraint.operands.includes(this.operand);
    if (!isValid) {
      throw new Error(`LogicalConstraint propertie invalid '${this.operand}'`);
    }
    return isValid;
  }
}
