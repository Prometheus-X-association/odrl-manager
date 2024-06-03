import instanciator from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logCyan, _logGreen, _logObject, _logYellow } from './utils';
import { PolicyDataFetcher, Custom } from 'PolicyDataFetcher';
import { EntityRegistry } from 'EntityRegistry';
import { Action, ActionType } from 'models/odrl/Action';

describe('Testing ODRL Policies', async () => {
  let evaluator: PolicyEvaluator;

  before(() => {
    EntityRegistry.cleanReferences();
    evaluator = new PolicyEvaluator();
  });

  it('Should validate display permission based on spatial constraint', async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'https://w3c.github.io/odrl/bp/examples/3',
      permission: [
        {
          target: 'http://example.com/asset:9898.movie',
          action: 'display',
          constraint: [
            {
              leftOperand: 'spatial',
              operator: 'eq',
              rightOperand: 'https://www.wikidata.org/resource/Q183',
              'dct:comment': 'i.e Germany',
            },
          ],
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true);

    if (policy) {
      class Fetcher extends PolicyDataFetcher {
        constructor(private country: string) {
          super();
        }
        protected async getSpatial(): Promise<string> {
          return this.country;
        }
      }

      let fetcher = new Fetcher('https://www.wikidata.org/resource/Q183');
      evaluator.setPolicy(policy, fetcher);
      let isPerformable = await evaluator.isActionPerformable(
        'display',
        'http://example.com/asset:9898.movie',
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to display in Germany',
      );

      fetcher = new Fetcher('https://www.wikidata.org/resource/Q142');
      evaluator.setPolicy(policy, fetcher);
      isPerformable = await evaluator.isActionPerformable(
        'display',
        'http://example.com/asset:9898.movie',
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to display outside Germany',
      );
    }
  });
  //
  it('Should validate use and distribute permissions based on purpose (eq), and modification prohibition', async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'http://example.org/policy/1234',
      permission: [
        {
          target: 'http://example.org/content/article1234',
          action: 'use',
          constraint: {
            leftOperand: 'purpose',
            operator: 'eq',
            rightOperand: 'non-commercial',
          },
        },
        {
          target: 'http://example.org/content/article1234',
          action: 'distribute',
          constraint: {
            leftOperand: 'purpose',
            operator: 'eq',
            rightOperand: 'non-commercial',
          },
        },
      ],
      prohibition: [
        {
          target: 'http://example.org/content/article1234',
          action: 'modify',
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true);

    if (policy) {
      class Fetcher extends PolicyDataFetcher {
        constructor(private userPurpose: string) {
          super();
        }
        protected async getPurpose(): Promise<string> {
          return this.userPurpose;
        }
      }

      let fetcher = new Fetcher('non-commercial');
      evaluator.setPolicy(policy, fetcher);

      let isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use for non-commercial purpose',
      );

      isPerformable = await evaluator.isActionPerformable(
        'distribute',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to distribute for non-commercial purpose',
      );

      isPerformable = await evaluator.isActionPerformable(
        'modify',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to modify, regardless of purpose',
      );

      fetcher = new Fetcher('commercial');
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use for commercial purpose',
      );

      isPerformable = await evaluator.isActionPerformable(
        'distribute',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to distribute for commercial purpose',
      );
    }
  });
  //
  it('Should validate use and distribute permissions based on purpose (isNoneOf), and modification prohibition', async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'http://example.org/policy/1234',
      permission: [
        {
          target: 'http://example.org/content/article1234',
          action: 'use',
          constraint: {
            leftOperand: 'purpose',
            operator: 'isNoneOf',
            rightOperand: ['non-commercial'],
          },
        },
        {
          target: 'http://example.org/content/article1234',
          action: 'distribute',
          constraint: {
            leftOperand: 'purpose',
            operator: 'isNoneOf',
            rightOperand: ['non-commercial'],
          },
        },
      ],
      prohibition: [
        {
          target: 'http://example.org/content/article1234',
          action: 'modify',
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true);

    if (policy) {
      class Fetcher extends PolicyDataFetcher {
        constructor(private userPurpose: string) {
          super();
        }
        protected async getPurpose(): Promise<string> {
          return this.userPurpose;
        }
      }

      let fetcher = new Fetcher('commercial');
      evaluator.setPolicy(policy, fetcher);

      let isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use for commercial purpose',
      );

      isPerformable = await evaluator.isActionPerformable(
        'distribute',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to distribute for commercial purpose',
      );

      isPerformable = await evaluator.isActionPerformable(
        'modify',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to modify, regardless of purpose',
      );

      fetcher = new Fetcher('non-commercial');
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use for non-commercial purpose',
      );

      isPerformable = await evaluator.isActionPerformable(
        'distribute',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to distribute for non-commercial purpose',
      );

      fetcher = new Fetcher('educational');
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use for educational purpose',
      );

      isPerformable = await evaluator.isActionPerformable(
        'distribute',
        'http://example.org/content/article1234',
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to distribute for educational purpose',
      );
    }
  });
});
