import instanciator from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logCyan, _logGreen, _logObject, _logYellow } from './utils';
import { Policy } from 'models/odrl/Policy';
import { ContextFetcher } from 'ContextFetcher';
import { ModelEssential } from 'ModelEssential';

const assignee = 'http://example.com/person:44';
const json = {
  '@context': 'https://www.w3.org/ns/odrl/2/',
  '@type': 'Agreement',
  obligation: [
    {
      assigner: 'http://example.com/org:43',
      assignee,
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
        {
          value: 'compensate',
          refinement: [
            {
              leftOperand: 'payAmount',
              operator: 'lt',
              rightOperand: 1000,
              unit: 'http://dbpedia.org/resource/Euro',
            },
          ],
        },
      ],
    },
  ],
};

// Todo: take assignee, target and action into account
class Fetcher extends ContextFetcher {
  constructor() {
    super();
  }
  // Overriding
  protected async getPayAmount(): Promise<number> {
    switch (this.options.assignee) {
      case 'http://example.com/person:44':
        return 500;
      case 'http://example.com/person:45':
        return 10;
      default:
        return 0;
    }
  }
}

describe(`Testing 'Obligations' related units`, async () => {
  let policy: Policy | null;
  let evaluator: PolicyEvaluator;
  before(() => {
    ModelEssential.cleanRelations();
    const fetcher = new Fetcher();
    evaluator = new PolicyEvaluator();
    evaluator.setFetcher(fetcher);
    policy = instanciator.genPolicyFrom(json);
    policy?.debug();
  });

  it(`Should retrieve assigned "RuleDuties" for specified "assignee"`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const valid = await policy?.validate();
    expect(valid).to.equal(true);
    if (policy) {
      evaluator.setPolicy(policy);
      const duties = await evaluator.getAssignedDuties(assignee);
      // _logObject(duties);
      expect(duties).to.have.lengthOf(1);
    }
  });

  it(`Should verify assignee's fulfillment of "Obligations"`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const fulfilled = await evaluator.fulfillDuties(assignee);
    expect(fulfilled).to.equal(true);
  });

  it(`Should validate policy and confirm performability of
    "play" action on the specified target`, async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'https://www.w3.org/ns/odrl/2/',
      '@type': 'Offer',
      permission: [
        {
          assigner: 'http://example.com/assigner:corp',
          target: 'http://example.com/music/1999.mp3',
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
                      rightOperand: 500,
                      unit: 'http://dbpedia.org/resource/Euro',
                    },
                  ],
                },
              ],
              /*
              constraint: [
                {
                  leftOperand: 'event',
                  operator: 'lt',
                  rightOperand: { '@id': 'odrl:policyUsage' },
                },
              ],
              */
            },
          ],
        },
      ],
    };
    const policy = instanciator.genPolicyFrom(json);
    policy?.debug();
    const valid = await policy?.validate();
    expect(valid).to.equal(true);
    if (policy) {
      evaluator.setPolicy(policy);
      const isPerformable = await evaluator.isActionPerformable(
        'play',
        'http://example.com/music/1999.mp3',
      );
      expect(isPerformable).to.equal(true);
    }
  });

  it(`Should validate a policy 'Agreement'`, async function () {
    const json = {
      '@context': 'https://www.w3.org/ns/odrl/2/',
      '@type': 'Agreement',
      assigner: 'http://example.com/org:43',
      assignee: 'http://example.com/person:45',
      obligation: [
        {
          // Todo:
          action: 'delete',
          target: 'http://example.com/document:XZY',
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
              // compensatedParty: 'http://wwf.org',
            },
          ],
        },
      ],
    };
    const policy = instanciator.genPolicyFrom(json);
    policy?.debug();
    const valid = await policy?.validate();
    expect(valid).to.equal(true);
    if (policy) {
      evaluator.setPolicy(policy);
      const agreed = await evaluator.evalAgreementForAssignee(
        'http://example.com/person:45',
      );
      expect(agreed).to.equal(true);
    }
  });
});
