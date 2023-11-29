import { PolicyValidator } from 'PolicyValidator';
import { LeftOperand } from './LeftOperand';
import { LogicalConstraint } from './LogicalConstraint';
import { Operator } from './Operator';
import { RightOperand } from './RightOperand';

export abstract class Constraint extends PolicyValidator {
  public uid?: string;
  public dataType?: string;
  public unit?: string;
  public status?: number;
  public operator: Operator;
  public leftOperand: LeftOperand | null;
  public rightOperand: RightOperand | null;
  private rightOperandReference?: null | string | string[];
  private logicalConstraints?: null | LogicalConstraint[];
  constructor(
    leftOperand: LeftOperand | null,
    operator: Operator,
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
}
