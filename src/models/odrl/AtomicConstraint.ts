import { Operator } from './Operator';
import { RightOperand } from './RightOperand';
import { LeftOperand } from './LeftOperand';
import { Constraint } from './Constraint';

export class AtomicConstraint extends Constraint {
  constructor(
    leftOperand: LeftOperand,
    operator: Operator,
    rightOperand: RightOperand,
  ) {
    super(leftOperand, operator, rightOperand);
  }

  async evaluate(): Promise<boolean> {
    if (this.leftOperand && this.rightOperand) {
      const leftValue: unknown = await this.leftOperand.evaluate();
      switch (this.operator?.value) {
        case Operator.EQ:
          return leftValue === this.rightOperand.value;
        case Operator.NEQ:
          return leftValue !== this.rightOperand.value;
        case Operator.GT:
          return (leftValue as number) > (this.rightOperand.value as number);
        case Operator.GEQ:
          return (leftValue as number) >= (this.rightOperand.value as number);
        case Operator.LT:
          return (leftValue as number) < (this.rightOperand.value as number);
        case Operator.LEQ:
          return (leftValue as number) <= (this.rightOperand.value as number);
      }
    }
    return false;
  }

  public async verify(): Promise<boolean> {
    const isValid =
      (await super.verify()) &&
      this.leftOperand instanceof LeftOperand &&
      this.operator instanceof Operator &&
      this.rightOperand instanceof RightOperand;
    if (!isValid) {
      throw new Error('AtomicConstraint propertie invalid');
    }
    return isValid;
  }
}
