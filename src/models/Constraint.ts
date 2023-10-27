import { LeftOperand } from './LeftOperand';
import { Operator } from './Operator';
import { RightOperand } from './RightOperand';

export abstract class Constraint {
  uid?: string;
  dataType?: string;
  unit?: string;
  status?: number;
  operator: Operator;
  leftOperand: LeftOperand | null;
  rightOperand: RightOperand | null;
  rightOperandReference: null | string | string[] = [];

  constructor(
    leftOperand: LeftOperand | null,
    operator: Operator,
    rightOperand: RightOperand | null,
  ) {
    this.leftOperand = leftOperand;
    this.operator = operator;
    this.rightOperand = rightOperand;
  }

  async evaluate(): Promise<boolean> {
    return false;
  }
}
