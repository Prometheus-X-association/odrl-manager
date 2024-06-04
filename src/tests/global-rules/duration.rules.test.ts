import instanciator from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logCyan, _logGreen, _logObject } from '../utils';
import { PolicyDataFetcher, Custom } from 'PolicyDataFetcher';
import { EntityRegistry } from 'EntityRegistry';

describe('Testing Time-Based Data Access Policy', async () => {
  let evaluator: PolicyEvaluator;
  const datasetTarget = 'http://example.org/data/dataset1234';

  before(() => {
    EntityRegistry.cleanReferences();
    evaluator = new PolicyEvaluator();
  });

  class Fetcher extends PolicyDataFetcher {
    private lastAccessDate: Date;

    constructor(private accessGrantedDate: Date) {
      super();
      this.lastAccessDate = accessGrantedDate;
    }

    @Custom()
    protected async getElapsedTime(): Promise<number> {
      const now = new Date();
      const diffMilliseconds = now.getTime() - this.lastAccessDate.getTime();
      const diffMicroseconds = diffMilliseconds * 1000;
      return diffMicroseconds;
    }
  }

  it('Should validate use permission based on elapsed time constraint', async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'http://example.org/policy/5678',
      permission: [
        {
          target: 'http://example.org/data/dataset1234',
          action: 'use',
          constraint: [
            {
              leftOperand: 'elapsedTime',
              operator: 'lt',
              rightOperand: 'P1Y', // One year period
            },
          ],
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true, 'Policy should be structurally valid');

    if (policy) {
      let fetcher = new Fetcher(
        new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      );
      evaluator.setPolicy(policy, fetcher);

      let isPerformable = await evaluator.isActionPerformable(
        'use',
        datasetTarget,
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use the dataset when access was granted 6 months ago',
      );

      let leftOperands = await evaluator.listLeftOperandsFor(datasetTarget);
      expect(leftOperands).to.deep.equal(
        ['elapsedTime'],
        'Only "elapsedTime" should be listed as a leftOperand',
      );

      fetcher = new Fetcher(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset when access was granted exactly one year ago',
      );

      fetcher = new Fetcher(new Date(Date.now() - 540 * 24 * 60 * 60 * 1000));
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset when access was granted 18 months ago',
      );

      isPerformable = await evaluator.isActionPerformable(
        'distribute',
        datasetTarget,
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to distribute the dataset, as it is not explicitly permitted',
      );

      fetcher = new Fetcher(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000));
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use the dataset when access was granted 1 day ago',
      );

      fetcher = new Fetcher(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use the dataset when access grant date is in the future',
      );

      const actions = await evaluator.getPerformableActions(datasetTarget);
      expect(actions).to.deep.equal(
        ['use'],
        'Only "use" action should be permitted on the dataset',
      );

      fetcher = new Fetcher(new Date('Invalid Date'));
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset when access grant date is unknown',
      );
    }
  });

  it('Should validate use permission based on event constraint', async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'http://example.org/policy/5678',
      permission: [
        {
          target: 'http://example.org/data/dataset1234',
          action: 'use',
          constraint: [
            {
              leftOperand: 'Event',
              operator: 'eq',
              rightOperand: 'Gaia-X Tech-X 2024',
            },
          ],
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true, 'Policy should be structurally valid');

    class EventFetcher extends PolicyDataFetcher {
      constructor(private event: string) {
        super();
      }

      @Custom()
      protected async getEvent(): Promise<string> {
        return this.event;
      }
    }

    if (policy) {
      let fetcher = new EventFetcher('Gaia-X Tech-X 2024');
      evaluator.setPolicy(policy, fetcher);

      let isPerformable = await evaluator.isActionPerformable(
        'use',
        datasetTarget,
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use the dataset during the Gaia-X Tech-X 2024 event',
      );

      let leftOperands = await evaluator.listLeftOperandsFor(datasetTarget);
      expect(leftOperands).to.deep.equal(
        ['Event'],
        'Only "Event" should be listed as a leftOperand',
      );

      fetcher = new EventFetcher('Gaia-X Tech-X 2023');
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset during the Gaia-X Tech-X 2023 event',
      );

      fetcher = new EventFetcher('Other Event 2024');
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset during Other Event 2024',
      );

      isPerformable = await evaluator.isActionPerformable(
        'distribute',
        datasetTarget,
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to distribute the dataset, as it is not explicitly permitted',
      );

      const actions = await evaluator.getPerformableActions(datasetTarget);
      expect(actions).to.deep.equal(
        ['use'],
        'Only "use" action should be permitted on the dataset',
      );
    }
  });

  it('Should validate use permission based on time limit constraint', async function () {
    _logCyan('\n> ' + this.test?.title);
    const json = {
      '@context': 'http://www.w3.org/ns/odrl.jsonld',
      '@type': 'Set',
      uid: 'http://example.org/policy/5678',
      permission: [
        {
          target: 'http://example.org/data/dataset1234',
          action: 'use',
          constraint: [
            {
              leftOperand: 'Datetime',
              operator: 'gteq',
              rightOperand: '2025-12-31T23:59Z',
            },
          ],
        },
      ],
    };

    const policy = instanciator.genPolicyFrom(json);
    expect(policy).to.not.be.null;
    policy?.debug();

    const valid = await policy?.validate();
    expect(valid).to.equal(true, 'Policy should be structurally valid');

    class DatetimeFetcher extends PolicyDataFetcher {
      constructor(private datetime: Date) {
        super();
      }

      @Custom()
      protected async getDatetime(): Promise<Date> {
        return this.datetime;
      }
    }

    if (policy) {
      let fetcher = new DatetimeFetcher(new Date('2026-01-01T00:00Z'));
      evaluator.setPolicy(policy, fetcher);

      let isPerformable = await evaluator.isActionPerformable(
        'use',
        datasetTarget,
      );
      expect(isPerformable).to.equal(
        true,
        'Should be allowed to use the dataset after the specified time limit',
      );

      let leftOperands = await evaluator.listLeftOperandsFor(datasetTarget);
      expect(leftOperands).to.deep.equal(
        ['Datetime'],
        'Only "Datetime" should be listed as a leftOperand',
      );

      fetcher = new DatetimeFetcher(new Date('2025-12-31T23:58Z'));
      evaluator.setPolicy(policy, fetcher);

      isPerformable = await evaluator.isActionPerformable('use', datasetTarget);
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to use the dataset before the specified time limit',
      );

      isPerformable = await evaluator.isActionPerformable(
        'distribute',
        datasetTarget,
      );
      expect(isPerformable).to.equal(
        false,
        'Should not be allowed to distribute the dataset, as it is not explicitly permitted',
      );

      const actions = await evaluator.getPerformableActions(datasetTarget);
      expect(actions).to.deep.equal(
        ['use'],
        'Only "use" action should be permitted on the dataset',
      );
    }
  });
});
