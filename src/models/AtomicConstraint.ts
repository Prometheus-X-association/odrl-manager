import { Operator } from 'models/Operator';
import { RightOperand } from 'models/RightOperand';
import { LeftOperand } from 'models/LeftOperand';
import { Constraint } from './Constraint';

export class AtomicConstraint extends Constraint {
  constructor(
    leftOperand: LeftOperand,
    operator: Operator,
    rightOperand: RightOperand,
  ) {
    super(leftOperand, operator, rightOperand);
  }

  async visit(): Promise<boolean> {
    if (this.leftOperand && this.rightOperand) {
      const leftValue: unknown = await this.leftOperand.visit();
      switch (this.operator?.value) {
        case Operator.EQ:
          return leftValue === this.rightOperand;
        case Operator.GT:
          return (leftValue as number) > (this.rightOperand.value as number);
        case Operator.LT:
          return (leftValue as number) < (this.rightOperand.value as number);
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
