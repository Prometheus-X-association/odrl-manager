import { ModelBasic } from '../ModelBasic';
import { LeftOperand } from './LeftOperand';
import { LogicalConstraint } from './LogicalConstraint';
import { Operator } from './Operator';
import { RightOperand } from './RightOperand';

export abstract class Constraint extends ModelBasic {
  public uid?: string;
  public dataType?: string;
  public unit?: string;
  public status?: number;
  public operator: Operator | null;
  public leftOperand: LeftOperand | null;
  public rightOperand: RightOperand | null;
  private rightOperandReference?: null | string | string[];
  private logicalConstraints?: null | LogicalConstraint[];
  constructor(
    leftOperand: LeftOperand | null,
    operator: Operator | null,
    rightOperand: RightOperand | null,
  ) {
    super();
    this.leftOperand = leftOperand;
    this.operator = operator;
    this.rightOperand = rightOperand;
  }

  async evaluate(): Promise<boolean> {
    return false;
  }

  protected async verify(): Promise<boolean> {
    try {
      const isValid =
        (this.uid === undefined || typeof this.uid === 'string') &&
        (this.dataType === undefined || typeof this.dataType === 'string') &&
        (this.unit === undefined || typeof this.unit === 'string') &&
        (this.status === undefined || typeof this.status === 'number');
      if (!isValid) {
        throw new Error('Some of your constraint properties are invalid');
      }
      return isValid;
    } catch (error: any) {
      throw error.message;
    }
  }
}
