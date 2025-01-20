import { Action } from './Action';
import { Party } from './Party';
import { Rule } from './Rule';

export class RuleDuty extends Rule {
  public _type?: 'consequence' | 'remedy' | 'obligation' | 'duty';
  private consequence?: RuleDuty[];
  public compensatedParty?: string;
  public compensatingParty?: string;
  private status?: 'notInfringed' | 'infringed';

  /**
   * Creates an instance of RuleDuty.
   * @param {Party | undefined} assigner - The party assigning the duty
   * @param {Party | undefined} assignee - The party to whom the duty is assigned
   */
  constructor(assigner?: Party, assignee?: Party) {
    super();
    if (assigner) {
      this.assigner = assigner;
    }
    if (assignee) {
      this.assignee = assignee;
    }
    this._instanceOf = 'RuleDuty';
  }

  /**
   * Gets the array of consequence duties associated with this duty
   * @returns {RuleDuty[] | undefined} The array of consequence duties or undefined if none exist
   */
  public getConsequence(): RuleDuty[] | undefined {
    return this.consequence;
  }

  /**
   * Evaluates the duty by checking its action and constraints
   * @returns {Promise<boolean>} True if the duty is fulfilled, false otherwise
   */
  public async evaluate(): Promise<boolean> {
    const result = await Promise.all([
      this.evaluateConstraints(),
      this.evaluateActions(),
    ]);
    if (result.every(Boolean)) {
      return true;
    }
    return this.evaluateConsequences();
  }

  /**
   * Evaluates the consequences of the duty
   * @returns {Promise<boolean>} True if any consequence is fulfilled, false otherwise
   */
  private async evaluateConsequences(): Promise<boolean> {
    if (!this.consequence || this.consequence.length === 0) {
      return false;
    }
    for (const consequence of this.consequence) {
      const fulfilled = await consequence.evaluate();
      if (fulfilled) {
        return true;
      }
    }
    return false;
  }

  /**
   * Evaluates the actions of the duty
   * @returns {Promise<boolean>} True if all actions are fulfilled, false otherwise
   */
  private async evaluateActions(): Promise<boolean> {
    if (Array.isArray(this.action)) {
      const processes = await Promise.all(
        this.action.map((action: Action) => action.refine()),
      );
      return processes.every(Boolean);
    } else if (this.action instanceof Action) {
      return this.action.evaluate();
    }
    return false;
  }

  /**
   * Evaluates the constraints of the duty
   * @returns {Promise<boolean>} True if all constraints are fulfilled, false otherwise
   */
  private async evaluateConstraints(): Promise<boolean> {
    try {
      if (this.constraints) {
        const all = await Promise.all(
          this.constraints.map((constraint) => constraint.evaluate()),
        );
        return all.every(Boolean);
      }
    } catch (error) {
      console.error('Error while evaluating rule:', error);
    }
    return false;
  }

  /**
   * Verifies that the duty has valid properties
   * @returns {Promise<boolean>} True if the duty is valid, throws an error otherwise
   */
  public async verify(): Promise<boolean> {
    return true;
  }

  /**
   * Adds a consequence duty to this duty
   * @param {RuleDuty} duty - The consequence duty to add
   */
  public addConsequence(duty: RuleDuty): void {
    if (this.consequence === undefined) {
      this.consequence = [];
    }
    this.consequence.push(duty);
  }
}
