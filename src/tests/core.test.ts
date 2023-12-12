import instanciator from 'PolicyInstanciator';
import evaluator from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logCyan, _logGreen, _logObject, _logYellow } from './utils';
import { ContextFetcher } from 'ContextFetcher';
import { Custom } from 'ContextFetcher';
describe('Testing Core units', async () => {
  before(() => {});

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
    instanciator.genPolicyFrom(json);
    instanciator.policy?.debug();
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
    instanciator.genPolicyFrom(json);
    const { policy } = instanciator;
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();
    const valid = await policy?.validate();
    expect(valid).to.equal(true);
    if (policy) {
      class Fetcher extends ContextFetcher {
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
        protected async getAge(): Promise<number> {
          return 18;
        }
      }
      evaluator.setPolicy(policy);
      const fetcher = new Fetcher();
      const age = await fetcher.context['age']();
      expect(age).to.equal(18);
      const absolutePosition = await fetcher.context.absolutePosition();
      expect(absolutePosition).to.equal(9);
      const language = await fetcher.context.language();
      expect(language).to.equal('en');
      evaluator.setFetcher(fetcher);
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
    instanciator.genPolicyFrom(json);
    const { policy } = instanciator;
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
    instanciator.genPolicyFrom(json);
    const { policy } = instanciator;
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
});
