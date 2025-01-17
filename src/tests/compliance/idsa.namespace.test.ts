import instanciator, { PolicyInstanciator } from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { Policy } from 'models/odrl/Policy';
import { PolicyDataFetcher } from 'PolicyDataFetcher';
import { EntityRegistry } from 'EntityRegistry';
import { Custom } from 'PolicyFetcher';
import { Extension, ModelBasic } from 'models/ModelBasic';
import { Namespace } from 'Namespace';
import { IDSAPolicy } from 'policy-helper/interoperability/idsa.policy.interface';

class DSpaceTimestamp extends ModelBasic {
  constructor(public timestamp: string) {
    super();
  }
  protected async verify(): Promise<boolean> {
    return true;
  }
}

class CreativeCommonsAction extends ModelBasic {
  constructor(public action: string) {
    super();
  }
  protected async verify(): Promise<boolean> {
    return true;
  }
}

class DSpaceNamespace {
  public static Timestamp(
    element: any,
    parent: any,
    root: Policy | null,
    fromArray: boolean = false,
  ): Extension | null {
    return {
      name: 'dspace:timestamp',
      value: new DSpaceTimestamp(element),
    };
  }
}

class CreativeCommons {
  public static Distribution(
    element: any,
    parent: any,
    root: Policy | null,
    fromArray: boolean = false,
  ): Extension | null {
    return {
      name: 'cc:Distribution',
      value: new CreativeCommonsAction('Distribution'),
    };
  }

  public static Attribution(
    element: any,
    parent: any,
    root: Policy | null,
    fromArray: boolean = false,
  ): Extension | null {
    return {
      name: 'cc:Attribution',
      value: new CreativeCommonsAction('Attribution'),
    };
  }

  public static ShareAlike(
    element: any,
    parent: any,
    root: Policy | null,
    fromArray: boolean = false,
  ): Extension | null {
    return {
      name: 'cc:ShareAlike',
      value: new CreativeCommonsAction('ShareAlike'),
    };
  }

  public static DerivativeWorks(
    element: any,
    parent: any,
    root: Policy | null,
    fromArray: boolean = false,
  ): Extension | null {
    return {
      name: 'cc:DerivativeWorks',
      value: new CreativeCommonsAction('DerivativeWorks'),
    };
  }
}

const dspaceNamespace: Namespace = new Namespace('http://www.dspace.org/ns/');
const ccNamespace: Namespace = new Namespace('http://creativecommons.org/ns#');

PolicyInstanciator.addNamespaceInstanciator(dspaceNamespace);
PolicyInstanciator.addNamespaceInstanciator(ccNamespace);

dspaceNamespace.addInstanciator('timestamp', DSpaceNamespace.Timestamp);

ccNamespace.addInstanciator('Distribution', CreativeCommons.Distribution);
ccNamespace.addInstanciator('Attribution', CreativeCommons.Attribution);
ccNamespace.addInstanciator('ShareAlike', CreativeCommons.ShareAlike);
ccNamespace.addInstanciator('DerivativeWorks', CreativeCommons.DerivativeWorks);

describe('Testing IDSA Policy with Namespaces', () => {
  let evaluator: PolicyEvaluator;

  before(() => {
    EntityRegistry.cleanReferences();
    evaluator = new PolicyEvaluator();
  });

  it('Should validate a policy with dspace timestamp', async () => {
    const inputPolicy = {
      '@context': [
        'http://www.w3.org/ns/odrl.jsonld',
        { dspace: 'http://www.dspace.org/ns/' },
      ],
      '@id': 'policy-id-timestamp',
      '@type': 'Set',
      'dspace:timestamp': '2025-01-15T10:00:00Z',
      'odrl:permission': [
        {
          'odrl:action': 'read',
          'odrl:target': 'http://example.com/resource-timestamp',
          'odrl:constraint': [
            {
              'odrl:leftOperand': 'dateTime',
              'odrl:operator': 'lteq',
              'odrl:rightOperand': '2025-12-31T23:59:59Z',
            },
          ],
        },
      ],
    };

    const outputPolicy = IDSAPolicy.parse(inputPolicy);
    const policy = instanciator.genPolicyFrom(outputPolicy);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();

    class TimestampDataFetcher extends PolicyDataFetcher {
      constructor() {
        super();
      }

      @Custom()
      protected async getDateTime(): Promise<Date> {
        return new Date('2025-06-15');
      }
    }

    const dataFetcher = new TimestampDataFetcher();
    if (policy) {
      evaluator.setPolicy(policy, dataFetcher);
      const isPerformable = await evaluator.isActionPerformable(
        'read',
        'http://example.com/resource-timestamp',
      );
      expect(isPerformable).to.equal(true);
    }
  });

  it('Should validate a policy with Creative Commons attributes', async () => {
    const inputPolicy = {
      '@context': [
        'http://www.w3.org/ns/odrl.jsonld',
        { cc: 'http://creativecommons.org/ns#' },
      ],
      '@id': 'policy-id-cc',
      '@type': 'Offer',
      'odrl:permission': [
        {
          'odrl:target': 'http://example.com/resource-cc',
          'odrl:action': 'cc:Distribution',
          'odrl:duty': [
            {
              'odrl:action': 'cc:Attribution',
            },
            {
              'odrl:action': 'cc:ShareAlike',
            },
          ],
        },
        {
          'odrl:target': 'http://example.com/resource-cc',
          'odrl:action': 'cc:DerivativeWorks',
        },
      ],
    };

    const outputPolicy = IDSAPolicy.parse(inputPolicy);
    const policy = instanciator.genPolicyFrom(outputPolicy);
    expect(policy).to.not.be.null;
    expect(policy).to.not.be.undefined;
    policy?.debug();

    class CCDataFetcher extends PolicyDataFetcher {
      constructor() {
        super();
      }
    }

    const dataFetcher = new CCDataFetcher();
    if (policy) {
      evaluator.setPolicy(policy, dataFetcher);

      IDSAPolicy.wrapper.setEvaluator(evaluator);
      const isDistributionPerformable =
        await IDSAPolicy.wrapper.isActionPerformable(
          'cc:Distribution',
          'http://example.com/resource-cc',
        );
      expect(isDistributionPerformable).to.equal(true);

      const isDerivativeWorksPerformable =
        await IDSAPolicy.wrapper.isActionPerformable(
          'cc:DerivativeWorks',
          'http://example.com/resource-cc',
        );
      expect(isDerivativeWorksPerformable).to.equal(true);

      const actions = await evaluator.getPerformableActions(
        'http://example.com/resource-cc',
      );
      expect(actions).to.include.members([
        'cc:Distribution',
        'cc:DerivativeWorks',
      ]);
    }
  });
});
