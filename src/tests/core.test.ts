import { PolicyInstanciator } from 'PolicyInstanciator';
import { expect } from 'chai';
import { _logObject } from './utils';
import { PolicyOffer } from 'models/PolicyOffer';
import { PolicyEvaluator } from 'PolicyEvaluator';

describe('Testing Core units', async () => {
  let evaluator: PolicyEvaluator;
  before(() => {
    evaluator = new PolicyEvaluator();
  });
  it('should...', async () => {
    const contract = {
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
          assigner: 'assigner',
          assignee: 'assignee',
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
      ],
    };

    const instanciator: PolicyInstanciator = new PolicyInstanciator();
    instanciator.genPolicyFrom(contract);
    console.log('\nDebug monitoring:');
    instanciator.policy?.debug();
    console.log('\nValidation monitoring:');
    const valid = await instanciator.policy?.launchValidation();
    expect(valid).to.equal(true);
  });
});
