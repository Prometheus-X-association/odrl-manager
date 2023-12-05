import { PolicyValidator } from '../PolicyValidator';

export class Operator extends PolicyValidator {
  public static readonly EQ: string = 'eq';
  public static readonly NEQ: string = 'neq';
  public static readonly GT: string = 'gt';
  public static readonly GEQ: string = 'gteq';
  public static readonly LT: string = 'lt';
  public static readonly LEQ: string = 'lteq';
  public static readonly IN: string = 'isPartOf';
  public static readonly HAS_PART: string = 'hasPart';
  public static readonly IS_A: string = 'isA';
  public static readonly IS_ALL_OF: string = 'isAllOf';
  public static readonly IS_ANY_OF: string = 'isAnyOf';
  public static readonly IS_NONE_OF: string = 'isNoneOf';

  public value: string;
  constructor(value: string) {
    super();
    this.value = value;
  }

  public async verify(): Promise<boolean> {
    const isValid = Object.values(Operator).includes(this.value);
    if (!isValid) {
      throw new Error(`Operator not valid: '${this.value}'`);
    }
    return isValid;
  }
}
