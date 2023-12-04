import { Policy } from 'models/Policy';

class PolicyEvaluator {
  public static instance: PolicyEvaluator;

  constructor() {}

  public static getInstance(): PolicyEvaluator {
    if (!PolicyEvaluator.instance) {
      PolicyEvaluator.instance = new PolicyEvaluator();
    }
    return PolicyEvaluator.instance;
  }

  public setPolicy(policy: Policy): void {}
  public setDataContext(data: any): void {}
  public async visitTarget(target: string): Promise<void> {}
}

export default PolicyEvaluator.getInstance();
