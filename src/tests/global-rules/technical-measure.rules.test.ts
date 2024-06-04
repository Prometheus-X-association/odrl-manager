import instanciator from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logCyan, _logGreen, _logObject } from '../utils';
import { EntityRegistry } from 'EntityRegistry';

describe('Testing Time-Based Data Access Policy', async () => {
  let evaluator: PolicyEvaluator;
  const datasetTarget = 'http://example.org/data/dataset1234';

  before(() => {
    EntityRegistry.cleanReferences();
    evaluator = new PolicyEvaluator();
  });

  it('Should enforce activity monitoring duty', async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': [
        'http://www.w3.org/ns/odrl.jsonld',
        {
          dpv: 'http://www.w3.org/ns/dpv#',
        },
      ],
      uid: 'http://example.org/policy/1234',
      type: 'Set',
      permission: [
        {
          target: 'http://example.org/data/dataset1234',
          action: 'use',
        },
      ],
      duty: [
        {
          action: 'dpv:activityMonitoring',
          target: 'http://example.org/data/dataset1234',
          assignee: 'http://example.org/party/data-user',
          constraint: {
            leftOperand: 'attributionNotice',
            operator: 'isA',
            rightOperand: 'required',
          },
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true, 'Policy should be structurally valid');

    if (policy) {
      evaluator.setPolicy(policy);

      let isPerformable = await evaluator.isActionPerformable(
        'use',
        datasetTarget,
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use the dataset',
      );

      let duties = await evaluator.getDutiesFor('use', datasetTarget);
      expect(duties).to.have.lengthOf(
        1,
        'Should have one duty for using the dataset',
      );
      expect(duties[0].action).to.equal(
        'dpv:activityMonitoring',
        'Duty should be activity monitoring',
      );
      expect(duties[0].assignee).to.equal(
        'http://example.org/party/data-user',
        'Duty should be assigned to the data user',
      );

      let constraints = duties[0].constraints;
      expect(constraints).to.have.lengthOf(
        1,
        'Duty should have one constraint',
      );
      expect(constraints[0].leftOperand).to.equal(
        'attributionNotice',
        'Constraint left operand should be attributionNotice',
      );
      expect(constraints[0].operator).to.equal(
        'isA',
        'Constraint operator should be isA',
      );
      expect(constraints[0].rightOperand).to.equal(
        'required',
        'Constraint right operand should be required',
      );
    }
  });
});
