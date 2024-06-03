import { Operator } from './Operator';
import { RightOperand } from './RightOperand';
import { LeftOperand } from './LeftOperand';
import { Constraint } from './Constraint';
import { EntityRegistry } from 'EntityRegistry';

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
      const fetcher = this.leftOperand._rootUID
        ? EntityRegistry.getDataFetcherFromPolicy(this.leftOperand._rootUID)
        : undefined;
      if (fetcher) {
        const bypass = fetcher.hasBypassFor(this.leftOperand.getValue());
        if (bypass) {
          return true;
        }
      }
      const evaluation: unknown = await this.leftOperand.evaluate();
      if (evaluation) {
        const [leftValue, types] = evaluation as [string | number, string[]];
        let rightValue = this.rightOperand.value;
        if (types && types.includes('date') && !Array.isArray(rightValue)) {
          rightValue = new Date(rightValue).getTime();
          if (isNaN(rightValue)) {
            console.warn(
              `\x1b[93m/!\\"${rightValue}" is not a supported Date\x1b[37m`,
            );
          }
        }
        switch (this.operator?.value) {
          case Operator.EQ:
            return leftValue === rightValue;

          case Operator.NE:
          case Operator.NEQ:
            return leftValue !== rightValue;

          case Operator.GT:
            return (leftValue as number) > (rightValue as number);

          case Operator.GTE:
          case Operator.GTEQ:
            return (leftValue as number) >= (rightValue as number);

          case Operator.LT:
            return (leftValue as number) < (rightValue as number);

          case Operator.LTE:
          case Operator.LTEQ:
            return (leftValue as number) <= (rightValue as number);
          case Operator.IS_NONE_OF:
            return (
              Array.isArray(rightValue) &&
              !(rightValue as Array<any>).includes(leftValue)
            );
        }
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
