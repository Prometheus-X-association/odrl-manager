export abstract class ContextFetcher {
  public leftOperands: Record<string, Function> = {
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
  };

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
    return '';
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
