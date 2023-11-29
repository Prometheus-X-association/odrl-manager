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

  async evaluate(): Promise<boolean> {
    if (this.leftOperand && this.rightOperand) {
      const leftValue: unknown = await this.leftOperand.evaluate();
      switch (this.operator.value) {
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

  public localValidation(): void {}
}
