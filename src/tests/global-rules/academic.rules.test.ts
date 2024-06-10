import instanciator from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logCyan, _logGreen, _logObject, _logYellow } from '../utils';
import { PolicyDataFetcher, Custom } from 'PolicyDataFetcher';
import { EntityRegistry } from 'EntityRegistry';
import { Action, ActionType } from 'models/odrl/Action';
import { PolicyStateFetcher } from 'PolicyStateFetcher';

//
describe('Testing Academic Research Data Usage Policy', async () => {
  let evaluator: PolicyEvaluator;
  const datasetTarget = 'http://example.org/data/dataset1234';

  before(() => {
    EntityRegistry.cleanReferences();
    evaluator = new PolicyEvaluator();
  });

  class StateFetcher extends PolicyStateFetcher {
    @Custom()
    public getAttribution(): boolean {
      return true;
    }
  }

  class DataFetcher extends PolicyDataFetcher {
    constructor(
      private userPurpose: string,
      private location: string,
      private lastAccessDate: Date,
      private attributionState: string,
    ) {
      super();
    }

    protected async getPurpose(): Promise<string> {
      return this.userPurpose;
    }
    protected async getSpatial(): Promise<string> {
      return this.location;
    }
    protected async getElapsedTime(): Promise<number> {
      const now = new Date();
      const diffMilliseconds = now.getTime() - this.lastAccessDate.getTime();
      return diffMilliseconds;
    }

    @Custom() protected async getAttributionNotice(): Promise<string> {
      return this.attributionState;
    }
  }

  it('Should validate academic research data usage policy with duties', async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': [
        'http://www.w3.org/ns/odrl.jsonld',
        {
          purposes: 'http://example.org/vocab/purpose#',
          actions: 'http://example.org/vocab/actions#',
        },
      ],
      '@type': 'Set',
      uid: 'http://example.org/policy/5678',
      permission: [
        {
          target: datasetTarget,
          action: 'use',
          constraint: [
            {
              leftOperand: 'purpose',
              operator: 'eq',
              rightOperand: 'purposes:academic-research',
            },
            {
              leftOperand: 'spatial',
              operator: 'eq',
              rightOperand: 'http://example.org/geo/restricted-area',
            },
            {
              leftOperand: 'elapsedTime',
              operator: 'lt',
              rightOperand: 'P1Y',
            },
          ],
          duty: [
            {
              action: 'attribution',
              target: datasetTarget,
              assignee: 'http://example.org/party/data-user',
              constraint: {
                leftOperand: 'attributionNotice',
                operator: 'isA',
                rightOperand: 'required',
              },
            },
          ],
        },
      ],
      prohibition: [
        {
          target: datasetTarget,
          action: 'modify',
        },
        {
          target: datasetTarget,
          action: 'actions:commercialize',
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true);

    if (policy) {
      let dataFetcher = new DataFetcher(
        'academic-research',
        'http://example.org/geo/restricted-area',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        'required',
      );
      let stateFetcher = new StateFetcher();
      evaluator.setPolicy(policy, dataFetcher, stateFetcher);

      let isPerformable = await evaluator.isActionPerformable(
        'use',
        datasetTarget,
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use the dataset for academic research in the restricted area within a year',
      );

      /*
      let actions = await evaluator.getPerformableActions(datasetTarget);
      expect(actions).to.deep.equal(
        ['use'],
        'Only "use" action should be permitted',
      );
      
      let duties = await evaluator.getAssignedDuties(
        'http://example.org/party/data-user',
      );
      expect(duties).to.have.lengthOf(1, 'Should have one assigned duty');
      expect((duties[0]?.action as Action)?.value).to.equal(
        'attribution',
        'Duty action should be attribution',
      );

      let dutyFulfilled = await evaluator.fulfillDuties(
        'http://example.org/party/data-user',
      );
      expect(dutyFulfilled).to.equal(
        true,
        'Attribution duty should be fulfilled',
      );

      fetcher = new Fetcher(
        'academic-research',
        'http://example.org/geo/other-area',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        'required',
      );
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset outside the restricted area',
      );

      fetcher = new Fetcher(
        'commercial',
        'http://example.org/geo/restricted-area',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        'required',
      );
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset for commercial purposes',
      );

      fetcher = new Fetcher(
        'academic-research',
        'http://example.org/geo/restricted-area',
        new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
        'required',
      );
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset after a year',
      );

      fetcher = new Fetcher(
        'academic-research',
        'http://example.org/geo/restricted-area',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        'not-required',
      );
      evaluator.setPolicy(policy, fetcher);

      dutyFulfilled = await evaluator.fulfillDuties(
        'http://example.org/party/data-user',
      );
      expect(dutyFulfilled).to.equal(
        false,
        'Attribution duty should not be fulfilled',
      );

      let prohibitedActions: ActionType[] = ['modify', 'commercialize'];
      for (const action of prohibitedActions) {
        isPerformable = await evaluator.isActionPerformable(
          action,
          datasetTarget,
        );
        expect(isPerformable).to.equal(
          false,
          `Should not be allowed to ${action} the dataset`,
        );
      }
        */
    }
  });
});
