import { expect } from 'chai';
import instanciator from 'PolicyInstanciator';
import { IDSAPolicy } from 'policy-helper/interfaces/idsa.policy.interface';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { PolicyDataFetcher, Custom } from 'PolicyDataFetcher';
import { EntityRegistry } from 'EntityRegistry';

describe('Testing IDSA Policy Parser', () => {
  let evaluator: PolicyEvaluator;

  before(() => {
    EntityRegistry.cleanReferences();
    evaluator = new PolicyEvaluator();
  });

  it('Should validate that the "read" action is performable on a resource after parsing', async () => {
    const inputPolicy = {
      '@id': 'policy-id-a0',
      '@type': 'Set',
      'odrl:profile': [{ '@id': 'http://example.com/profile-type-a' }],
      'odrl:permission': [
        {
          'odrl:action': 'read',
          'odrl:target': 'http://example.com/resource-type-a0',
          'odrl:constraint': [
            {
              'odrl:leftOperand': 'language',
              'odrl:operator': 'eq',
              'odrl:rightOperand': 'en',
            },
          ],
        },
      ],
    };

    const outputPolicy = IDSAPolicy.parse(inputPolicy);
    const policy = instanciator.genPolicyFrom(outputPolicy);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();

    class TestDataFetcher extends PolicyDataFetcher {
      constructor() {
        super();
      }

      @Custom()
      protected async getLanguage(): Promise<string> {
        return 'en';
      }
    }

    const dataFetcher = new TestDataFetcher();

    if (policy) {
      evaluator.setPolicy(policy, dataFetcher);
      const isPerformable = await evaluator.isActionPerformable(
        'read',
        'http://example.com/resource-type-a0',
      );
      expect(isPerformable).to.equal(true);
    }
  });

  it('Should list the correct leftOperands for a specific resource after parsing', async () => {
    const inputPolicy = {
      '@id': 'policy-id-b1',
      '@type': 'Set',
      'odrl:profile': [{ '@id': 'http://example.com/profile-type-b' }],
      'odrl:permission': [
        {
          'odrl:action': 'read',
          'odrl:target': 'http://example.com/resource-type-b1',
          'odrl:constraint': [
            {
              'odrl:leftOperand': 'language',
              'odrl:operator': 'eq',
              'odrl:rightOperand': 'en',
            },
            {
              'odrl:leftOperand': 'dateTime',
              'odrl:operator': 'gt',
              'odrl:rightOperand': '2023-01-01',
            },
          ],
        },
      ],
    };

    const outputPolicy = IDSAPolicy.parse(inputPolicy);
    const policy = instanciator.genPolicyFrom(outputPolicy);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();

    class TestDataFetcher extends PolicyDataFetcher {
      constructor() {
        super();
      }

      @Custom()
      protected async getLanguage(): Promise<string> {
        return 'en';
      }

      @Custom()
      protected async getDateTime(): Promise<Date> {
        return new Date('2023-12-31');
      }
    }

    const dataFetcher = new TestDataFetcher();
    if (policy) {
      evaluator.setPolicy(policy, dataFetcher);

      const leftOperands = await evaluator.listLeftOperandsFor(
        'http://example.com/resource-type-b1',
      );
      expect(leftOperands).to.have.members(['language', 'dateTime']);
    }
  });
});
