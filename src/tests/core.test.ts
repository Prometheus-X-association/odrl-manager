import { parseODRL } from 'PolicyInstanciator';
import { expect } from 'chai';
import { _logObject } from './utils';
import { PolicyOffer } from 'models/PolicyOffer';
import { PolicyEvaluator } from 'PolicyEvaluator';

describe('Testing Core units', () => {
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
                  leftOperand: 'b',
                  operator: 'eq',
                  rightOperand: 1,
                },
              ],
            },
          ],
        },
      ],
    };
    /*
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
    };
    */

    const policy: PolicyOffer = parseODRL(contract) as PolicyOffer;
    _logObject(policy);

    // todo
    evaluator.visitPolicy(policy);
  });
});
