import instanciator from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logCyan, _logGreen, _logObject, _logYellow } from './utils';
import { PolicyDataFetcher, Custom } from 'PolicyDataFetcher';
// import { Custom } from 'PolicyFetcher';
import { EntityRegistry } from 'EntityRegistry';

describe('Testing Core units', async () => {
  let evaluator: PolicyEvaluator;
  before(() => {
    EntityRegistry.cleanReferences();
    evaluator = new PolicyEvaluator();
  });

  it(`should validate a policy after parsing it.`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Offer',
      permission: [
        {
          action: 'read',
          target: 'http://target-a',
          constraint: [
            {
              leftOperand: 'media',
              operator: 'eq',
              rightOperand: 'print',
            },
            {
              operator: 'and',
              constraint: [
                {
                  leftOperand: 'dateTime',
                  operator: 'gt',
                  rightOperand: '2018-01-01',
                },
                {
                  leftOperand: 'dateTime',
                  operator: 'lt',
                  rightOperand: '2019-01-01',
                },
                {
                  leftOperand: 'dateTime',
                  operator: 'neq',
                  rightOperand: '2018-01-02',
                },
              ],
            },
          ],
        },
        {
          action: 'use',
          target: 'http://target-b',
        },
        {
          assigner: 'assigner-a',
          target: 'http://target-e',
          action: 'play',
          duty: [
            {
              action: [
                {
                  value: 'compensate',
                  refinement: [
                    {
                      leftOperand: 'payAmount',
                      operator: 'eq',
                      rightOperand: '5.00',
                      unit: 'http://dbpedia.org/resource/Euro',
                    },
                  ],
                },
              ],
              constraint: [
                {
                  leftOperand: 'event',
                  operator: 'lt',
                  rightOperand: 'policyUsage',
                },
              ],
            },
          ],
        },
      ],
      prohibition: [
        {
          action: 'play',
          target: 'http://target-c',
          constraint: [
            {
              leftOperand: 'dateTime',
              operator: 'gteq',
              rightOperand: '2017-12-31',
            },
          ],
        },
      ],
      obligation: [
        {
          assigner: 'assigner-b',
          assignee: 'assignee-b',
          action: [
            {
              value: 'compensate',
              refinement: [
                {
                  leftOperand: 'payAmount',
                  operator: 'eq',
                  rightOperand: 500,
                  unit: 'http://dbpedia.org/resource/Euro',
                },
              ],
            },
          ],
        },
        {
          action: 'delete',
          target: 'http://target-d',
          consequence: [
            {
              action: [
                {
                  value: 'compensate',
                  refinement: [
                    {
                      leftOperand: 'payAmount',
                      operator: 'eq',
                      rightOperand: 10,
                      unit: 'http://dbpedia.org/resource/Euro',
                    },
                  ],
                },
              ],
              compensatedParty: 'http://wwf.org',
            },
          ],
        },
      ],
    };
    instanciator.genPolicyFrom(json)?.debug();
    const valid = await instanciator.policy?.validate();
    expect(valid).to.equal(true);
  });

  it(`Should validate policy constraints and confirm performability
    of "read" action on the specified target with customized data fetcher`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Set',
      permission: [
        {
          action: 'read',
          target: 'http://contract-target',
          constraint: [
            {
              leftOperand: 'age',
              operator: 'gteq',
              rightOperand: 18,
            },
            {
              leftOperand: 'age',
              operator: 'gte',
              rightOperand: 18,
            },
            {
              leftOperand: 'age',
              operator: 'lteq',
              rightOperand: 18,
            },
            {
              leftOperand: 'age',
              operator: 'lte',
              rightOperand: 18,
            },
          ],
        },
        {
          action: 'read',
          target: 'http://contract-target',
          constraint: [
            {
              leftOperand: 'role',
              operator: 'eq',
              rightOperand: 'admin',
            },
          ],
        },
      ],
      prohibition: [
        {
          action: 'read',
          target: 'http://contract-target',
          constraint: [
            {
              leftOperand: 'age',
              operator: 'gt',
              rightOperand: 21,
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
      class Fetcher extends PolicyDataFetcher {
        private absolutePosition: number = 0;
        constructor() {
          super();
          this.absolutePosition = 9;
        }
        // Overriding
        protected async getAbsolutePosition(): Promise<number> {
          return this.absolutePosition;
        }
        // Custom fetching
        @Custom()
        protected async getRole(): Promise<string> {
          return 'admin';
        }
        @Custom()
        protected async getAge(): Promise<number> {
          return 18;
        }
        protected async getPayAmount(): Promise<number> {
          return 0;
        }
      }
      const fetcher = new Fetcher();
      evaluator.setPolicy(policy, fetcher);
      const age = await fetcher.context['age']();
      expect(age).to.equal(18);
      const absolutePosition = await fetcher.context.absolutePosition();
      expect(absolutePosition).to.equal(9);
      const language = await fetcher.context.language();
      expect(language).to.equal('en');
      const isPerformable = await evaluator.isActionPerformable(
        'read',
        'http://contract-target',
      );
      expect(isPerformable).to.equal(true);
    }
  });

  it(`Should retrieve performable actions on a specific target`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Set',
      permission: [
        {
          action: 'use',
          target: 'http://offering-target',
        },
        {
          action: 'read',
          target: 'http://contract-target',
        },
        {
          action: 'write',
          target: 'http://contract-target',
        },
      ],
      prohibition: [
        {
          action: 'read',
          target: 'http://contract-target',
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
      evaluator.setPolicy(policy);
      const actions = await evaluator.getPerformableActions(
        'http://contract-target',
      );
      _logYellow('\nPerformable actions:');
      _logObject(actions);
      expect(actions).to.deep.equal(['write']);
    }
  });

  it(`Should retrieve leftOperands associated with a specific target`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Set',
      permission: [
        {
          action: 'use',
          target: 'http://other-contract-target',
          constraint: [
            {
              leftOperand: 'media',
              operator: 'eq',
              rightOperand: 'print',
            },
            {
              leftOperand: 'count',
              operator: 'eq',
              rightOperand: 0,
            },
          ],
        },
        {
          action: 'use',
          target: 'http://contract-target',
          constraint: [
            {
              leftOperand: 'age',
              operator: 'gt',
              rightOperand: 21,
            },
            {
              leftOperand: 'count',
              operator: 'eq',
              rightOperand: 0,
            },
          ],
        },
      ],
      prohibition: [
        {
          action: 'use',
          target: 'http://contract-target',
          constraint: [
            {
              leftOperand: 'age',
              operator: 'gt',
              rightOperand: 22,
            },
            {
              leftOperand: 'dateTime',
              operator: 'eq',
              rightOperand: 0,
            },
          ],
        },
      ],
    };
    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();
    if (policy) {
      evaluator.setPolicy(policy);
      const leftOperands = await evaluator.listLeftOperandsFor(
        'http://contract-target',
      );
      _logYellow('\nAssociated leftOperands:');
      _logObject(leftOperands);
      const expectedValues = ['age', 'count', 'dateTime'];
      expect(leftOperands).to.have.members(expectedValues);
      expect(leftOperands)
        .to.have.members(expectedValues)
        .and.to.have.lengthOf(expectedValues.length);
    }
  });

  it(`Should confirm the exploitability of resources listed in a policy set.`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Set',
      permission: [
        {
          action: 'use',
          target: 'http://contract-target',
        },
        {
          action: 'read',
          target: 'http://contract-target/video',
        },
        {
          action: 'write',
          target: 'http://contract-target/cloud',
        },
      ],
      prohibition: [
        {
          action: 'use',
          target: 'http://contract-target',
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
      evaluator.setPolicy(policy);
      const resourcesPolicy = {
        '@context': 'http://www.w3.org/ns/odrl/2/',
        '@type': 'Set',
        permission: [
          {
            action: 'use',
            target: 'http://contract-target',
          },
          {
            action: 'read',
            target: 'http://contract-target/video',
          },
          {
            action: 'write',
            target: 'http://contract-target/cloud',
          },
        ],
      };
      const isAccessible =
        await evaluator.evalResourcePerformabilities(resourcesPolicy);
      expect(isAccessible).to.equal(false);
    }
  });

  it(`Should evaluate complementary policies.`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const permission = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Set',
      permission: [
        {
          action: 'use',
          target: 'http://contract-target',
        },
        {
          action: 'read',
          target: 'http://contract-target/note',
        },
      ],
    };
    const prohibition = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Set',
      prohibition: [
        {
          action: 'use',
          target: 'http://contract-target',
        },
      ],
    };
    const permissionPolicy = instanciator.genPolicyFrom(permission);
    const prohibitionPolicy = instanciator.genPolicyFrom(prohibition);
    expect(permissionPolicy).to.exist;
    expect(prohibitionPolicy).to.exist;
    if (permissionPolicy && prohibitionPolicy) {
      permissionPolicy.debug();
      prohibitionPolicy.debug();
      evaluator.cleanPolicies();
      evaluator.addPolicy(permissionPolicy);
      evaluator.addPolicy(prohibitionPolicy);
      let actions = await evaluator.getPerformableActions(
        'http://contract-target',
      );
      _logYellow('\nPerformable actions for "http://contract-target":');
      _logObject(actions);
      expect(actions).to.deep.equal([]);
      actions = await evaluator.getPerformableActions(
        'http://contract-target/note',
      );
      _logYellow('\nPerformable actions for "http://contract-target/note":');
      _logObject(actions);
      expect(actions).to.deep.equal(['read']);
    }
  });

  it(`Should confirm resource readability
    if the request occurs 1 seconds post-creation.`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const creationDate = new Date();
    creationDate.setSeconds(creationDate.getSeconds() + 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const json = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Set',
      permission: [
        {
          action: 'read',
          target: 'http://resource-target',
          constraint: [
            {
              leftOperand: 'dateTime',
              operator: 'gteq',
              rightOperand: creationDate.toISOString(),
            },
          ],
        },
      ],
    };
    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();
    if (policy) {
      class Fetcher extends PolicyDataFetcher {
        constructor() {
          super();
        }
      }
      const fetcher = new Fetcher();
      evaluator.setPolicy(policy, fetcher);
      const isPerformable = await evaluator.isActionPerformable(
        'read',
        'http://resource-target',
      );
      expect(isPerformable).to.equal(true);
    }
  });

  it(`Should allow access to a resource by bypassing a non-existent leftOperand
  and also test combined bypass with another constraint`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Set',
      permission: [
        {
          action: 'read',
          target: 'http://resource-target',
          constraint: [
            {
              leftOperand: 'nonExistentAttribute',
              operator: 'eq',
              rightOperand: 'someValue',
            },
            {
              leftOperand: 'location',
              operator: 'eq',
              rightOperand: 'US',
            },
          ],
        },
      ],
    };
    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();
    if (policy) {
      class Fetcher extends PolicyDataFetcher {
        constructor() {
          super();
          this.setBypassFor('nonExistentAttribute');
        }

        @Custom()
        protected async getLocation(): Promise<string> {
          return 'FR';
        }
      }
      const fetcher = new Fetcher();
      evaluator.setPolicy(policy, fetcher);

      let isPerformable = await evaluator.isActionPerformable(
        'read',
        'http://resource-target',
      );
      expect(isPerformable).to.equal(
        false,
        'Should be false as location is not bypassed',
      );

      fetcher.setBypassFor('location');
      isPerformable = await evaluator.isActionPerformable(
        'read',
        'http://resource-target',
      );
      expect(isPerformable).to.equal(
        true,
        'Should be true as both constraints are bypassed',
      );
    }
  });
});
