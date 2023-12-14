import { Policy } from '../odrl/Policy';
import { Application } from 'models/dpv/Application';
import { Service } from 'models/dpv/Service';

export class PolicyPreference extends Policy {
  '@type': 'Preference' = 'Preference';
  public application?: Application;
  public service?: Service;
  constructor(uid: string, context: string) {
    super(uid, context, 'Preference');
  }

  public async visit(): Promise<boolean> {
    return false;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
