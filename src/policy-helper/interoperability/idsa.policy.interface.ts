import { parsePolicy } from '../parsers/idsa.parser.json';
import { IDSAEvaluatorWrapper } from '../wrappers/idsa.evaluator.wrapper';

export namespace IDSAPolicy {
  export const enum Action {
    Delete = 'odrl:delete',
    Execute = 'odrl:execute',
    SourceCode = 'cc:SourceCode',
    Anonymize = 'odrl:anonymize',
    Extract = 'odrl:extract',
    Read = 'odrl:read',
    Index = 'odrl:index',
    Compensate = 'odrl:compensate',
    Sell = 'odrl:sell',
    Derive = 'odrl:derive',
    EnsureExclusivity = 'odrl:ensureExclusivity',
    Annotate = 'odrl:annotate',
    Reproduction = 'cc:Reproduction',
    Translate = 'odrl:translate',
    Include = 'odrl:include',
    DerivativeWorks = 'cc:DerivativeWorks',
    Distribution = 'cc:Distribution',
    TextToSpeech = 'odrl:textToSpeech',
    Inform = 'odrl:inform',
    GrantUse = 'odrl:grantUse',
    Archive = 'odrl:archive',
    Modify = 'odrl:modify',
    Aggregate = 'odrl:aggregate',
    Attribute = 'odrl:attribute',
    NextPolicy = 'odrl:nextPolicy',
    Digitize = 'odrl:digitize',
    Attribution = 'cc:Attribution',
    Install = 'odrl:install',
    ConcurrentUse = 'odrl:concurrentUse',
    Distribute = 'odrl:distribute',
    Synchronize = 'odrl:synchronize',
    Move = 'odrl:move',
    ObtainConsent = 'odrl:obtainConsent',
    Print = 'odrl:print',
    Notice = 'cc:Notice',
    Give = 'odrl:give',
    Uninstall = 'odrl:uninstall',
    Sharing = 'cc:Sharing',
    ReviewPolicy = 'odrl:reviewPolicy',
    Watermark = 'odrl:watermark',
    Play = 'odrl:play',
    Reproduce = 'odrl:reproduce',
    Transform = 'odrl:transform',
    Display = 'odrl:display',
    Stream = 'odrl:stream',
    ShareAlike = 'cc:ShareAlike',
    AcceptTracking = 'odrl:acceptTracking',
    CommercialUse = 'cc:CommericalUse',
    Present = 'odrl:present',
    Use = 'odrl:use',
  }

  export const enum LeftOperand {
    AbsolutePosition = 'odrl:absolutePosition',
    AbsoluteSize = 'odrl:absoluteSize',
    AbsoluteSpatialPosition = 'odrl:absoluteSpatialPosition',
    AbsoluteTemporalPosition = 'odrl:absoluteTemporalPosition',
    Count = 'odrl:count',
    DateTime = 'odrl:dateTime',
    DelayPeriod = 'odrl:delayPeriod',
    DeliveryChannel = 'odrl:deliveryChannel',
    Device = 'odrl:device',
    ElapsedTime = 'odrl:elapsedTime',
    Event = 'odrl:event',
    FileFormat = 'odrl:fileFormat',
    Industry = 'odrl:industry',
    Language = 'odrl:language',
    Media = 'odrl:media',
    MeteredTime = 'odrl:meteredTime',
    PayAmount = 'odrl:payAmount',
    Percentage = 'odrl:percentage',
    Product = 'odrl:product',
    Purpose = 'odrl:purpose',
    Recipient = 'odrl:recipient',
    RelativePosition = 'odrl:relativePosition',
    RelativeSize = 'odrl:relativeSize',
    RelativeSpatialPosition = 'odrl:relativeSpatialPosition',
    RelativeTemporalPosition = 'odrl:relativeTemporalPosition',
    Resolution = 'odrl:resolution',
    Spatial = 'odrl:spatial',
    SpatialCoordinates = 'odrl:spatialCoordinates',
    System = 'odrl:system',
    SystemDevice = 'odrl:systemDevice',
    TimeInterval = 'odrl:timeInterval',
    UnitOfCount = 'odrl:unitOfCount',
    Version = 'odrl:version',
    VirtualLocation = 'odrl:virtualLocation',
  }

  export const enum Operator {
    Equals = 'odrl:eq',
    GreaterThan = 'odrl:gt',
    GreaterThanOrEquals = 'odrl:gteq',
    HasPart = 'odrl:hasPart',
    IsA = 'odrl:isA',
    IsAllOf = 'odrl:isAllOf',
    IsAnyOf = 'odrl:isAnyOf',
    IsNoneOf = 'odrl:isNoneOf',
    IsPartOf = 'odrl:isPartOf',
    LessThan = 'odrl:lt',
    LessThanOrEquals = 'odrl:lteq',
    TermLessThanOrEquals = 'odrl:term-lteq',
    NotEquals = 'odrl:neq',
  }

  export type RightOperandValue = string | number | boolean;

  export interface IReference {
    '@id': string;
  }

  export interface IConstraint {
    'odrl:leftOperand': LeftOperand;
    'odrl:operator': Operator;
    'odrl:rightOperand'?: RightOperandValue;
    'odrl:rightOperandReference'?: IReference;
  }

  export interface IAbstractPolicyRule {
    'odrl:assigner'?: string;
    'odrl:assignee'?: string;
  }

  export interface IDuty extends IAbstractPolicyRule {
    '@id'?: string;
    'odrl:action': Action;
    'odrl:constraint'?: IConstraint[];
  }

  export interface IPermission extends IAbstractPolicyRule {
    'odrl:action': Action;
    'odrl:constraint'?: IConstraint[];
    'odrl:duty'?: IDuty;
  }

  export interface IProhibition extends IAbstractPolicyRule {
    'odrl:action': Action;
    'odrl:constraint'?: IConstraint[];
  }

  export interface IPolicyClass extends IAbstractPolicyRule {
    '@id': string;
    'odrl:profile'?: IReference[];
    'odrl:permission'?: IPermission[];
    'odrl:obligation'?: IDuty[];
  }

  export interface IMessageOffer extends IPolicyClass {
    '@type': 'odrl:Offer';
    'odrl:permission': IPermission[];
    'odrl:prohibition': IProhibition[];
  }

  export interface IAgreement {
    '@type': 'odrl:Agreement';
    '@id': string;
    'odrl:target': string;
    'dspace:timestamp': string;
    'odrl:permission': IPermission;
    'odrl:prohibition': IProhibition;
  }

  export const parse = parsePolicy;
  export const wrapper = IDSAEvaluatorWrapper;
}
