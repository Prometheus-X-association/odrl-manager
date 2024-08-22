import { ModelBasic } from '../ModelBasic';
import { Constraint } from './Constraint';

export class PartyCollection extends ModelBasic {
  private source?: string;
  private refinement?: Constraint;
  public async verify(): Promise<boolean> {
    return true;
  }
}
