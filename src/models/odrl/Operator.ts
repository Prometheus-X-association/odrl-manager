import { ModelBasic } from '../ModelBasic';

export class Operator extends ModelBasic {
  public static readonly EQ: string = 'eq';
  public static readonly NEQ: string = 'neq';
  public static readonly GT: string = 'gt';
  public static readonly GTEQ: string = 'gteq';
  public static readonly LT: string = 'lt';
  public static readonly LTEQ: string = 'lteq';
  public static readonly IS_PART_OF: string = 'isPartOf';
  public static readonly HAS_PART: string = 'hasPart';
  public static readonly IS_A: string = 'isA';
  public static readonly IS_ALL_OF: string = 'isAllOf';
  public static readonly IS_ANY_OF: string = 'isAnyOf';
  public static readonly IS_NONE_OF: string = 'isNoneOf';

  public static readonly NE: string = 'ne';
  public static readonly GTE: string = 'gte';
  public static readonly LTE: string = 'lte';

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
