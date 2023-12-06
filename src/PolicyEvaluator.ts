import { ContextFetcher } from 'ContextFetcher';
import { Policy } from './models/Policy';

export class PolicyEvaluator {
  public static instance: PolicyEvaluator;
  private policy: Policy | null;
  private fetcher: ContextFetcher | null;
  constructor() {
    this.policy = null;
    this.fetcher = null;
  }

  public static getInstance(): PolicyEvaluator {
    if (!PolicyEvaluator.instance) {
      PolicyEvaluator.instance = new PolicyEvaluator();
    }
    return PolicyEvaluator.instance;
  }

  public setPolicy(policy: Policy): void {
    this.policy = policy;
  }

  public setContextFetcher(fetcher: ContextFetcher): void {
    this.fetcher = fetcher;
  }
  public async visitTarget(target: string): Promise<void> {}
}

export default PolicyEvaluator.getInstance();
