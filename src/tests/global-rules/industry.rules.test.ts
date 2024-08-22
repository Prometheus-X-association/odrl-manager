import instanciator from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { PolicyDataFetcher, Custom } from 'PolicyDataFetcher';
import { EntityRegistry } from 'EntityRegistry';

describe('Activity Area/Sectors - Industry Specific Data Usage Test', async () => {
  let evaluator: PolicyEvaluator;

  before(() => {
    EntityRegistry.cleanReferences();
    evaluator = new PolicyEvaluator();
  });

  it('should allow data usage for Clothing and textile industries', async function () {
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'http://example.org/policy/5678',
      permission: [
        {
          target: 'http://example.org/data/dataset1234',
          action: 'use',
          constraint: [
            {
              leftOperand: 'Industry',
              operator: 'eq',
              rightOperand: 'Clothing and textile industries',
            },
          ],
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true);

    if (policy) {
      class IndustryFetcher extends PolicyDataFetcher {
        constructor() {
          super();
        }

        @Custom()
        protected async getIndustry(): Promise<string> {
          return 'Clothing and textile industries';
        }
      }

      const fetcher = new IndustryFetcher();
      evaluator.setPolicy(policy, fetcher);

      const isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/data/dataset1234',
      );

      expect(isPerformable).to.equal(true);
    }
  });

  it('should deny data usage for non-Clothing and textile industries', async function () {
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'http://example.org/policy/5678',
      permission: [
        {
          target: 'http://example.org/data/dataset1234',
          action: 'use',
          constraint: [
            {
              leftOperand: 'Industry',
              operator: 'eq',
              rightOperand: 'Clothing and textile industries',
            },
          ],
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true);

    if (policy) {
      class IndustryFetcher extends PolicyDataFetcher {
        constructor() {
          super();
        }

        @Custom()
        protected async getIndustry(): Promise<string> {
          return 'Automotive industry';
        }
      }

      const fetcher = new IndustryFetcher();
      evaluator.setPolicy(policy, fetcher);

      const isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/data/dataset1234',
      );

      expect(isPerformable).to.equal(false);
    }
  });

  it('should allow data usage for all sectors except Clothing and textile industries', async function () {
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      uid: 'http://example.org/policy/5678',
      '@type': 'Set',
      permission: [
        {
          target: 'http://example.org/data/dataset1234',
          action: 'use',
          constraint: [
            {
              leftOperand: 'Industry',
              operator: 'isNoneOf',
              rightOperand: ['Clothing and textile industries'],
            },
          ],
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true);

    if (policy) {
      class IndustryFetcher extends PolicyDataFetcher {
        constructor() {
          super();
        }

        @Custom()
        protected async getIndustry(): Promise<string> {
          return 'Automotive industry';
        }
      }

      const fetcher = new IndustryFetcher();
      evaluator.setPolicy(policy, fetcher);

      const isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/data/dataset1234',
      );

      expect(isPerformable).to.equal(true);
    }
  });

  it('should deny data usage for Clothing and textile industries when excluded', async function () {
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'http://example.org/policy/5678',
      permission: [
        {
          target: 'http://example.org/data/dataset1234',
          action: 'use',
          constraint: [
            {
              leftOperand: 'Industry',
              operator: 'isNoneOf',
              rightOperand: ['Clothing and textile industries'],
            },
          ],
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true);

    if (policy) {
      class IndustryFetcher extends PolicyDataFetcher {
        constructor() {
          super();
        }

        @Custom()
        protected async getIndustry(): Promise<string> {
          return 'Clothing and textile industries';
        }
      }

      const fetcher = new IndustryFetcher();
      evaluator.setPolicy(policy, fetcher);

      const isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/data/dataset1234',
      );

      expect(isPerformable).to.equal(false);
    }
  });
});
