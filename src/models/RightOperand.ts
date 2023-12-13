import { ModelEssential } from '../ModelEssential';

export class RightOperand extends ModelEssential {
  public value: string | number;

  constructor(value: string | number) {
    super();
    this.value = value;
  }

  public async verify(): Promise<boolean> {
    //
    return true;
  }
}
