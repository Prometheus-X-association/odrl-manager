namespace IDSAPolicy {
  export enum Action {
    'odrl:delete',
    'odrl:execute',
    'cc:SourceCode',
    'odrl:anonymize',
    'odrl:extract',
    'odrl:read',
    'odrl:index',
    'odrl:compensate',
    'odrl:sell',
    'odrl:derive',
    'odrl:ensureExclusivity',
    'odrl:annotate',
    'cc:Reproduction',
    'odrl:translate',
    'odrl:include',
    'cc:DerivativeWorks',
    'cc:Distribution',
    'odrl:textToSpeech',
    'odrl:inform',
    'odrl:grantUse',
    'odrl:archive',
    'odrl:modify',
    'odrl:aggregate',
    'odrl:attribute',
    'odrl:nextPolicy',
    'odrl:digitize',
    'cc:Attribution',
    'odrl:install',
    'odrl:concurrentUse',
    'odrl:distribute',
    'odrl:synchronize',
    'odrl:move',
    'odrl:obtainConsent',
    'odrl:print',
    'cc:Notice',
    'odrl:give',
    'odrl:uninstall',
    'cc:Sharing',
    'odrl:reviewPolicy',
    'odrl:watermark',
    'odrl:play',
    'odrl:reproduce',
    'odrl:transform',
    'odrl:display',
    'odrl:stream',
    'cc:ShareAlike',
    'odrl:acceptTracking',
    'cc:CommericalUse',
    'odrl:present',
    'odrl:use',
  }

  export enum LeftOperand {
    'odrl:absolutePosition',
    'odrl:absoluteSize',
    'odrl:absoluteSpatialPosition',
    'odrl:absoluteTemporalPosition',
    'odrl:count',
    'odrl:dateTime',
    'odrl:delayPeriod',
    'odrl:deliveryChannel',
    'odrl:device',
    'odrl:elapsedTime',
    'odrl:event',
    'odrl:fileFormat',
    'odrl:industry',
    'odrl:language',
    'odrl:media',
    'odrl:meteredTime',
    'odrl:payAmount',
    'odrl:percentage',
    'odrl:product',
    'odrl:purpose',
    'odrl:recipient',
    'odrl:relativePosition',
    'odrl:relativeSize',
    'odrl:relativeSpatialPosition',
    'odrl:relativeTemporalPosition',
    'odrl:resolution',
    'odrl:spatial',
    'odrl:spatialCoordinates',
    'odrl:system',
    'odrl:systemDevice',
    'odrl:timeInterval',
    'odrl:unitOfCount',
    'odrl:version',
    'odrl:virtualLocation',
  }

  export enum Operator {
    'odrl:eq',
    'odrl:gt',
    'odrl:gteq',
    'odrl:hasPart',
    'odrl:isA',
    'odrl:isAllOf',
    'odrl:isAnyOf',
    'odrl:isNoneOf',
    'odrl:isPartOf',
    'odrl:lt',
    'odrl:term-lteq',
    'odrl:neq',
  }

  export interface IAbstractPolicyRule {
    'odrl:assigner': string;
    'odrl:assignee': string;
  }

  export interface IPolicyClass extends IAbstractPolicyRule {
    '@id': string;
    'odrl:profile'?: IReference[];
    'odrl:permission'?: IPermission[];
    'odrl:obligation'?: IDuty[];
  }

  export interface IMessageOffer extends IPolicyClass {
    '@type': 'odrl:Offer';
    'odrl:permission': any;
    'odrl:prohibition': any;
  }

  export interface IPermission extends IAbstractPolicyRule {
    'odrl:action': Action;
    'odrl:constraint'?: IConstraint[];
    'odrl:duty'?: IDuty;
  }

  export interface IProhibition extends IAbstractPolicyRule {}

  export interface IDuty extends IAbstractPolicyRule {
    '@id'?: string;
    'odrl:action': Action;
    'odrl:constraint'?: IConstraint[];
  }

  export interface IRightOperand {}

  export interface IReference {
    '@id': string;
  }

  export interface IConstraint {
    'odrl:rightOperand'?: IRightOperand;
    'odrl:rightOperandReference'?: IReference;
    'odrl:leftOperand'?: LeftOperand;
    'odrl:operator'?: Operator;
  }

  export interface IAgreement {
    '@type': 'odrl:Agreement';
    '@id': string;
    'odrl:target': string;
    'dspace:timestamp': string;
    'odrl:permission': IPermission;
    'odrl:prohibition': IProhibition;
  }
}
