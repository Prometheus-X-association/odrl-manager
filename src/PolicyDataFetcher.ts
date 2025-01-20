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

  /**
   * Gets the types associated with a left operand
   * @param {string} leftOperand - The left operand to get types for
   * @returns {string[]} Array of types
   */
  public getTypes(leftOperand: string): string[] {
    return Object.entries(this.types)
      .flatMap(([key, values]) => (values.includes(leftOperand) ? key : []))
      .filter(Boolean);
  }

  /**
   * Gets the context containing left operand functions
   * @returns {LeftOperandFunctions} The left operand functions context
   */
  public get context(): LeftOperandFunctions {
    return this._context as LeftOperandFunctions;
  }

  /**
   * Gets the absolute position
   * @returns {Promise<number>} The absolute position
   */
  protected async getAbsolutePosition(): Promise<number> {
    return 0;
  }

  /**
   * Gets the absolute size
   * @returns {Promise<number>} The absolute size
   */
  protected async getAbsoluteSize(): Promise<number> {
    return 0;
  }

  /**
   * Gets the absolute spatial position
   * @returns {Promise<[number, number]>} The absolute spatial position
   */
  protected async getAbsoluteSpatialPosition(): Promise<[number, number]> {
    return [0, 0];
  }

  /**
   * Gets the absolute temporal position
   * @returns {Promise<Date>} The absolute temporal position
   */
  protected async getAbsoluteTemporalPosition(): Promise<Date> {
    return new Date();
  }

  /**
   * Gets the count
   * @returns {Promise<number>} The count
   */
  protected async getCount(): Promise<number> {
    return 0;
  }

  /**
   * Gets the date and time
   * @returns {Promise<Date>} The date and time
   */
  protected async getDateTime(): Promise<Date> {
    return new Date();
  }

  /**
   * Gets the delay period
   * @returns {Promise<number>} The delay period
   */
  protected async getDelayPeriod(): Promise<number> {
    return 0;
  }

  /**
   * Gets the delivery channel
   * @returns {Promise<string>} The delivery channel
   */
  protected async getDeliveryChannel(): Promise<string> {
    return '';
  }

  /**
   * Gets the device
   * @returns {Promise<string>} The device
   */
  protected async getDevice(): Promise<string> {
    return '';
  }

  /**
   * Gets the elapsed time
   * @returns {Promise<number>} The elapsed time
   */
  protected async getElapsedTime(): Promise<number> {
    return 0;
  }

  /**
   * Gets the event
   * @returns {Promise<string>} The event
   */
  protected async getEvent(): Promise<string> {
    return '';
  }

  /**
   * Gets the file format
   * @returns {Promise<string>} The file format
   */
  protected async getFileFormat(): Promise<string> {
    return '';
  }

  /**
   * Gets the industry
   * @returns {Promise<string>} The industry
   */
  protected async getIndustry(): Promise<string> {
    return '';
  }

  /**
   * Gets the language
   * @returns {Promise<string>} The language
   */
  protected async getLanguage(): Promise<string> {
    return 'en';
  }

  /**
   * Gets the media
   * @returns {Promise<string>} The media
   */
  protected async getMedia(): Promise<string> {
    return '';
  }

  /**
   * Gets the metered time
   * @returns {Promise<number>} The metered time
   */
  protected async getMeteredTime(): Promise<number> {
    return 0;
  }

  /**
   * Gets the pay amount
   * @returns {Promise<number>} The pay amount
   */
  protected async getPayAmount(): Promise<number> {
    return 0;
  }

  /**
   * Gets the percentage
   * @returns {Promise<number>} The percentage
   */
  protected async getPercentage(): Promise<number> {
    return 0;
  }

  /**
   * Gets the product
   * @returns {Promise<string>} The product
   */
  protected async getProduct(): Promise<string> {
    return '';
  }

  /**
   * Gets the purpose
   * @returns {Promise<string>} The purpose
   */
  protected async getPurpose(): Promise<string> {
    return '';
  }

  /**
   * Gets the recipient
   * @returns {Promise<string>} The recipient
   */
  protected async getRecipient(): Promise<string> {
    return '';
  }

  /**
   * Gets the relative position
   * @returns {Promise<number>} The relative position
   */
  protected async getRelativePosition(): Promise<number> {
    return 0;
  }

  /**
   * Gets the relative size
   * @returns {Promise<number>} The relative size
   */
  protected async getRelativeSize(): Promise<number> {
    return 0;
  }

  /**
   * Gets the relative spatial position
   * @returns {Promise<[number, number]>} The relative spatial position
   */
  protected async getRelativeSpatialPosition(): Promise<[number, number]> {
    return [0, 0];
  }

  /**
   * Gets the relative temporal position
   * @returns {Promise<Date>} The relative temporal position
   */
  protected async getRelativeTemporalPosition(): Promise<Date> {
    return new Date();
  }

  /**
   * Gets the resolution
   * @returns {Promise<number>} The resolution
   */
  protected async getResolution(): Promise<number> {
    return 0;
  }

  /**
   * Gets the spatial
   * @returns {Promise<string>} The spatial
   */
  protected async getSpatial(): Promise<string> {
    return '';
  }

  /**
   * Gets the spatial coordinates
   * @returns {Promise<[number, number]>} The spatial coordinates
   */
  protected async getSpatialCoordinates(): Promise<[number, number]> {
    return [0, 0];
  }

  /**
   * Gets the system
   * @returns {Promise<string>} The system
   */
  protected async getSystem(): Promise<string> {
    return '';
  }

  /**
   * Gets the system device
   * @returns {Promise<string>} The system device
   */
  protected async getSystemDevice(): Promise<string> {
    return '';
  }

  /**
   * Gets the time interval
   * @returns {Promise<[Date, Date]>} The time interval
   */
  protected async getTimeInterval(): Promise<[Date, Date]> {
    const now = new Date();
    return [now, now];
  }

  /**
   * Gets the unit of count
   * @returns {Promise<string>} The unit of count
   */
  protected async getUnitOfCount(): Promise<string> {
    return '';
  }

  /**
   * Gets the version
   * @returns {Promise<string>} The version
   */
  protected async getVersion(): Promise<string> {
    return '';
  }

  /**
   * Gets the virtual location
   * @returns {Promise<string>} The virtual location
   */
  protected async getVirtualLocation(): Promise<string> {
    return '';
  }
}
