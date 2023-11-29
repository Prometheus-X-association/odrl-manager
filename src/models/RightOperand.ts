import { DebugMonitor } from 'DebugMonitor';

export class RightOperand extends DebugMonitor {
  public value: string | number;

  constructor(value: string | number) {
    super();
    this.value = value;
  }
}
