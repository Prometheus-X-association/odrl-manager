import { Constraint } from './Constraint';
import { Operator } from './Operator';

export class LogicalConstraint extends Constraint {
  static readonly operands: string[] = ['and', 'andSequence', 'or', 'xone'];

  /**
   * Array of constraints in this logical constraint
   * @private
   */
  private constraint: Constraint[];

  /**
   * The logical operand ('and', 'andSequence', 'or', 'xone')
   * @private
   */
  private operand?: string;

  /**
   * Creates an instance of LogicalConstraint
   * @param {string} operand - The logical operand to be used ('and', 'andSequence', 'or', 'xone')
   */
  constructor(operand: string) {
    super(null, null, null);
    this._instanceOf = 'LogicalConstraint';
    this.operand = operand;
    this.constraint = [];
  }

  /**
   * Adds a constraint to the logical constraint's collection
   * @param {Constraint} constraint - The constraint to add
   */
  public addConstraint(constraint: Constraint) {
    this.constraint.push(constraint);
  }

  /**
   * Evaluates the logical constraint based on its operand type
   * @returns {Promise<boolean>} The result of evaluating all child constraints combined with the logical operand
   */
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

  /**
   * Verifies that the logical constraint is valid
   * @returns {Promise<boolean>} True if the constraint is valid, throws an error otherwise
   */
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
