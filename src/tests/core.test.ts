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
          target: 'http://contract-target',
          constraint: [
            {
              leftOperand: 'age',
              operator: 'gt',
              rightOperand: 17,
            },
            {
              operator: 'and',
              constraint: [
                {
                  leftOperand: 'a',
                  operator: 'eq',
                  rightOperand: 0,
                },
                {
                  aleftOperand: 'a',
                  aoperator: 'eq',
                  arightOperand: 0,
                },
                {
                  leftOperand: 'b',
                  operator: 'eq',
                  rightOperand: 1,
                },
              ],
            },
          ],
        },
        {
          action: 'use',
          target: 'http://contract-target-to-be-used',
          constraint: [
            {
              leftOperand: 'age',
              operator: 'gt',
              rightOperand: 17,
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
              rightOperand: 23,
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
