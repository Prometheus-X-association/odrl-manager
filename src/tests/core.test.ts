import instanciator from 'PolicyInstanciator';
import evaluator from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logObject } from './utils';
import { ContextFetcher } from 'ContextFetcher';

describe('Testing Core units', async () => {
  before(() => {
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
  });

  it('should validate a policy after parsing it.', async () => {
    const valid = await instanciator.policy?.launchValidation();
    expect(valid).to.equal(true);
  });

  it('should evaluate a simple permission with a custom left operand.', async () => {
    const json = {
      '@context': 'http://www.w3.org/ns/odrl/2/',
      '@type': 'Offer',
      permission: [
        {
          action: 'read',
          target: 'http://contract-target',
          constraint: [
            {
              leftOperand: 'age',
              operator: 'gt',
              rightOperand: 17,
            },
          ],
        },
      ],
    };
    instanciator.genPolicyFrom(json);
    const { policy } = instanciator;
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    if (policy) {
      class Fetcher extends ContextFetcher {
        private absolutePosition: number = 0;
        constructor() {
          super();
          this.leftOperands.age = this.getAge.bind(this);
          this.absolutePosition = 9;
        }
        // Overriding
        public async getAbsolutePosition(): Promise<number> {
          return this.absolutePosition;
        }
        // Custom fetching
        private async getAge(): Promise<number> {
          return 18;
        }
      }
      evaluator.setPolicy(policy);
      const fetcher = new Fetcher();
      const value = await fetcher.getAbsolutePosition();
      console.log(value);
      evaluator.setContextFetcher(new Fetcher());
      await evaluator.visitTarget('http://contract-target');
    }
  });
});
