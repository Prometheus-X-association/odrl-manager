import { PolicyFetcher } from 'PolicyFetcher';

export const Custom = (): MethodDecorator => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    if (descriptor && typeof descriptor.value === 'function') {
      target.customMethods = target.customMethods || [];
      target.customMethods.push(key);
    }
  };
};

interface LeftOperandFunctions {
  absolutePosition: () => Promise<number>;
  absoluteSize: () => Promise<number>;
  absoluteSpatialPosition: () => Promise<[number, number]>;
  absoluteTemporalPosition: () => Promise<Date>;
  count: () => Promise<number>;
  dateTime: () => Promise<Date>;
  delayPeriod: () => Promise<number>;
  deliveryChannel: () => Promise<string>;
  device: () => Promise<string>;
  elapsedTime: () => Promise<number>;
  event: () => Promise<string>;
  fileFormat: () => Promise<string>;
  industry: () => Promise<string>;
  language: () => Promise<string>;
  media: () => Promise<string>;
  meteredTime: () => Promise<number>;
  payAmount: () => Promise<number>;
  percentage: () => Promise<number>;
  product: () => Promise<string>;
  purpose: () => Promise<string>;
  recipient: () => Promise<string>;
  relativePosition: () => Promise<number>;
  relativeSize: () => Promise<number>;
  relativeSpatialPosition: () => Promise<[number, number]>;
  relativeTemporalPosition: () => Promise<Date>;
  resolution: () => Promise<number>;
  spatial: () => Promise<string>;
  spatialCoordinates: () => Promise<[number, number]>;
  system: () => Promise<string>;
  systemDevice: () => Promise<string>;
  timeInterval: () => Promise<[Date, Date]>;
  unitOfCount: () => Promise<string>;
  version: () => Promise<string>;
  virtualLocation: () => Promise<string>;
  [key: string]: Function;
}

export abstract class PolicyDataFetcher extends PolicyFetcher {
  private types: { [key: string]: string[] } = {
    date: [
      'dateTime',
      'absoluteTemporalPosition',
      'relativeTemporalPosition',
      'timeInterval',
      'elapsedTime',
    ],
    // boolean: [''],
  };

  constructor() {
    super();
    this._context = {
      absolutePosition: this.getAbsolutePosition.bind(this),
      absoluteSize: this.getAbsoluteSize.bind(this),
      absoluteSpatialPosition: this.getAbsoluteSpatialPosition.bind(this),
      absoluteTemporalPosition: this.getAbsoluteTemporalPosition.bind(this),
      count: this.getCount.bind(this),
      dateTime: this.getDateTime.bind(this),
      delayPeriod: this.getDelayPeriod.bind(this),
      deliveryChannel: this.getDeliveryChannel.bind(this),
      device: this.getDevice.bind(this),
      elapsedTime: this.getElapsedTime.bind(this),
      event: this.getEvent.bind(this),
      fileFormat: this.getFileFormat.bind(this),
      industry: this.getIndustry.bind(this),
      language: this.getLanguage.bind(this),
      media: this.getMedia.bind(this),
      meteredTime: this.getMeteredTime.bind(this),
      payAmount: this.getPayAmount.bind(this),
      percentage: this.getPercentage.bind(this),
      product: this.getProduct.bind(this),
      purpose: this.getPurpose.bind(this),
      recipient: this.getRecipient.bind(this),
      relativePosition: this.getRelativePosition.bind(this),
      relativeSize: this.getRelativeSize.bind(this),
      relativeSpatialPosition: this.getRelativeSpatialPosition.bind(this),
      relativeTemporalPosition: this.getRelativeTemporalPosition.bind(this),
      resolution: this.getResolution.bind(this),
      spatial: this.getSpatial.bind(this),
      spatialCoordinates: this.getSpatialCoordinates.bind(this),
      system: this.getSystem.bind(this),
      systemDevice: this.getSystemDevice.bind(this),
      timeInterval: this.getTimeInterval.bind(this),
      unitOfCount: this.getUnitOfCount.bind(this),
      version: this.getVersion.bind(this),
      virtualLocation: this.getVirtualLocation.bind(this),
      ...this._context,
    };
  }

  public getTypes(leftOperand: string): string[] {
    return Object.entries(this.types)
      .flatMap(([key, values]) => (values.includes(leftOperand) ? key : []))
      .filter(Boolean);
  }

  public get context(): LeftOperandFunctions {
    return this._context as LeftOperandFunctions;
  }

  protected async getAbsolutePosition(): Promise<number> {
    return 0;
  }

  protected async getAbsoluteSize(): Promise<number> {
    return 0;
  }

  protected async getAbsoluteSpatialPosition(): Promise<[number, number]> {
    return [0, 0];
  }

  protected async getAbsoluteTemporalPosition(): Promise<Date> {
    return new Date();
  }

  protected async getCount(): Promise<number> {
    return 0;
  }

  protected async getDateTime(): Promise<Date> {
    return new Date();
  }

  protected async getDelayPeriod(): Promise<number> {
    return 0;
  }

  protected async getDeliveryChannel(): Promise<string> {
    return '';
  }

  protected async getDevice(): Promise<string> {
    return '';
  }

  protected async getElapsedTime(): Promise<number> {
    return 0;
  }

  protected async getEvent(): Promise<string> {
    return '';
  }

  protected async getFileFormat(): Promise<string> {
    return '';
  }

  protected async getIndustry(): Promise<string> {
    return '';
  }

  protected async getLanguage(): Promise<string> {
    return 'en';
  }

  protected async getMedia(): Promise<string> {
    return '';
  }

  protected async getMeteredTime(): Promise<number> {
    return 0;
  }

  protected async getPayAmount(): Promise<number> {
    return 0;
  }

  protected async getPercentage(): Promise<number> {
    return 0;
  }

  protected async getProduct(): Promise<string> {
    return '';
  }

  protected async getPurpose(): Promise<string> {
    return '';
  }

  protected async getRecipient(): Promise<string> {
    return '';
  }

  protected async getRelativePosition(): Promise<number> {
    return 0;
  }

  protected async getRelativeSize(): Promise<number> {
    return 0;
  }

  protected async getRelativeSpatialPosition(): Promise<[number, number]> {
    return [0, 0];
  }

  protected async getRelativeTemporalPosition(): Promise<Date> {
    return new Date();
  }

  protected async getResolution(): Promise<number> {
    return 0;
  }

  protected async getSpatial(): Promise<string> {
    return '';
  }

  protected async getSpatialCoordinates(): Promise<[number, number]> {
    return [0, 0];
  }

  protected async getSystem(): Promise<string> {
    return '';
  }

  protected async getSystemDevice(): Promise<string> {
    return '';
  }

  protected async getTimeInterval(): Promise<[Date, Date]> {
    const now = new Date();
    return [now, now];
  }

  protected async getUnitOfCount(): Promise<string> {
    return '';
  }

  protected async getVersion(): Promise<string> {
    return '';
  }

  protected async getVirtualLocation(): Promise<string> {
    return '';
  }
}
