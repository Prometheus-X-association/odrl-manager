import instanciator, { PolicyInstanciator } from 'PolicyInstanciator';
import { PolicyEvaluator } from 'PolicyEvaluator';
import { expect } from 'chai';
import { _logCyan, _logGreen, _logObject, _logYellow } from './utils';
import { Policy } from 'models/odrl/Policy';
import { PolicyDataFetcher } from 'PolicyDataFetcher';
import { EntityRegistry } from 'EntityRegistry';
import { PolicyStateFetcher } from 'PolicyStateFetcher';
import { Custom } from 'PolicyFetcher';
import { Extension, ModelBasic } from 'models/ModelBasic';
import { Namespace } from 'Namespace';

class StateFetcher extends PolicyStateFetcher {
  constructor() {
    super();
  }

  @Custom()
  protected async getVerifySubscription(): Promise<boolean> {
    return true;
  }
}

class DataFetcher extends PolicyDataFetcher {
  constructor() {
    super();
  }

  protected async getPayAmount(): Promise<number> {
    const assigner = PolicyEvaluator.findAssigner(this.currentNode);
    if (assigner === 'http://example.com/assigner:sony') {
      return 5.0;
    }
    switch (this.currentNode?.unit) {
      case 'EUR':
        return 99;
      case 'PTX Credit':
        return 150;
      default:
        return 0;
    }
  }

  protected async getDateTime(): Promise<Date> {
    const creationDate = new Date();
    creationDate.setMinutes(creationDate.getMinutes() + 0);
    return creationDate;
  }
}

class UnitPriceSpecification extends ModelBasic {
  constructor(
    public hasCurrency: string,
    public hasCurrencyValue: number,
    public priceType: string,
  ) {
    super();
  }
  protected async verify(): Promise<boolean> {
    return true;
  }
}
class GoodRelations {
  public static UnitPriceSpecification(
    element: any,
    parent: any,
    root: Policy | null,
    fromArray: boolean = false,
  ): Extension | null {
    return {
      name: 'gr:UnitPriceSpecification',
      value: new UnitPriceSpecification(
        element['gr:hasCurrency'],
        element['gr:hasCurrencyValue'],
        element['gr:priceType'],
      ),
    };
  }
  public static PaymentMethod(
    element: any,
    parent: any,
    root: Policy | null,
    fromArray: boolean = false,
  ): Extension | null {
    return { name: 'gr:PaymentMethod', value: element.split(':').pop() };
  }
}
const grNamespace: Namespace = new Namespace('http://purl.org/goodrelations/');
PolicyInstanciator.addNamespaceInstanciator(grNamespace);
grNamespace.addInstanciator(
  'UnitPriceSpecification',
  GoodRelations.UnitPriceSpecification,
);
grNamespace.addInstanciator('PaymentMethod', GoodRelations.PaymentMethod);

describe('Testing Consequences in ODRL Policy', async () => {
  let policy: Policy | null;
  let policyRefinement: Policy | null;
  let evaluator: PolicyEvaluator;
  let dataFetcher: DataFetcher;
  let stateFetcher: StateFetcher;

  const creationDate = new Date();
  creationDate.setMinutes(creationDate.getMinutes() + 1);

  const policyJson = {
    '@context': 'http://www.w3.org/ns/odrl.jsonld',
    '@type': 'Agreement',
    permission: [
      {
        target: 'http://example.com/asset:66',
        action: 'use',
        duty: [
          {
            action: 'compensate',
            constraint: [
              {
                uid: 'constraint:1',
                leftOperand: 'payAmount',
                operator: 'eq',
                rightOperand: 100,
                unit: 'EUR',
              },
            ],
            consequence: [
              {
                action: 'compensate',
                constraint: [
                  {
                    uid: 'constraint:2',
                    leftOperand: 'payAmount',
                    operator: 'eq',
                    rightOperand: '200.00',
                    unit: 'PTX Credit',
                  },
                ],
                consequence: [
                  {
                    // Custom Action
                    action: 'verifySubscription',
                    constraint: [
                      {
                        uid: 'constraint:3',
                        leftOperand: 'dateTime',
                        operator: 'lteq',
                        rightOperand: creationDate.toISOString(),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const policyJsonRefinement = {
    '@context': [
      'http://www.w3.org/ns/odrl.jsonld',
      {
        gr: 'http://purl.org/goodrelations/',
      },
    ],
    '@type': 'Offer',
    uid: 'http://example.com/policy:88',
    profile: 'http://example.com/odrl:profile:09',
    permission: [
      {
        assigner: 'http://example.com/assigner:sony',
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
                    rightOperand: 5,
                    unit: 'http://dbpedia.org/resource/Euro',
                    'gr:UnitPriceSpecification': {
                      'gr:hasCurrency': 'EUR',
                      'gr:hasCurrencyValue': 5,
                      'gr:priceType': 'Purchase',
                    },
                    'gr:PaymentMethod': 'gr:DirectDebit',
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
  };

  before(() => {
    EntityRegistry.cleanReferences();
    policy = instanciator.genPolicyFrom(policyJson);
    policyRefinement = instanciator.genPolicyFrom(policyJsonRefinement);
    policy?.debug();
    policyRefinement?.debug();
    dataFetcher = new DataFetcher();
    stateFetcher = new StateFetcher();
    evaluator = new PolicyEvaluator();
  });

  it('Should validate the policy', async function () {
    _logCyan('\n> ' + this.test?.title);
    const valid = await policy?.validate();
    expect(valid).to.equal(true);
  });

  it('Should verify action performability based on consequences', async function () {
    _logCyan('\n> ' + this.test?.title);
    if (policy) {
      evaluator.setPolicy(policy, dataFetcher, stateFetcher);
      const isPerformable = await evaluator.isActionPerformable(
        'use',
        'http://example.com/asset:66',
      );
      expect(isPerformable).to.equal(
        true,
        'Expected the action to be performable.',
      );
      expect(evaluator.hasFailed('constraint:1')).to.equal(
        true,
        'Expected the constraint "constraint:1" to have failed.',
      );
      expect(evaluator.hasFailed('constraint:2')).to.equal(
        true,
        'Expected the constraint "constraint:2" to have failed.',
      );
      expect(evaluator.hasFailed('constraint:3')).to.equal(
        false,
        'Expected the constraint "constraint:3" to succeed.',
      );
    } else {
      throw new Error('Policy with could not be instantiated');
    }
  });

  it('Should validate and evaluate the policy with refinement', async function () {
    _logCyan('\n> ' + this.test?.title);
    if (policyRefinement) {
      const valid = await policyRefinement.validate();
      expect(valid).to.equal(
        true,
        'Expected the policy with refinement to be valid.',
      );
      evaluator.setPolicy(policyRefinement, dataFetcher, stateFetcher);
      const isPerformable = await evaluator.isActionPerformable(
        'play',
        'http://example.com/music/1999.mp3',
      );
      expect(isPerformable).to.equal(
        true,
        'Expected the "play" action to be performable.',
      );
    } else {
      throw new Error('Policy with refinement could not be instantiated');
    }
  });
});
