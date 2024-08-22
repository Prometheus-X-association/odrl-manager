import { ModelBasic } from '../ModelBasic';
import { PartyCollection } from './PartyCollection';

export class Party extends ModelBasic {
  public uid: string;
  private partOf?: PartyCollection;
  constructor(uid: string) {
    super();
    this.uid = uid;
  }
  public async verify(): Promise<boolean> {
    return true;
  }
}
