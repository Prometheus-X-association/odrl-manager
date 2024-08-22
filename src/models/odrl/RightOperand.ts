import { ModelBasic } from '../ModelBasic';

export class RightOperand extends ModelBasic {
  public '@id'?: string;
  public value: string | number | [];

  constructor(value: string | number) {
    super();
    this._instanceOf = 'RightOperand';
    this.value = value;
  }

  public async verify(): Promise<boolean> {
    //
    return true;
  }
}
