import { PolicyEvaluator } from 'PolicyEvaluator';

export class IDSAEvaluatorWrapper {
  private static evaluator: PolicyEvaluator;
  static async isActionPerformable(
    actionType: any,
    target: string,
    defaultResult: boolean = false,
    resetFailures: boolean = true,
  ): Promise<boolean> {
    return IDSAEvaluatorWrapper.evaluator.isActionPerformable(
      actionType,
      target,
      defaultResult,
      resetFailures,
    );
  }
  static setEvaluator(evaluator: PolicyEvaluator) {
    IDSAEvaluatorWrapper.evaluator = evaluator;
  }
  // todo: add other methods if needed
}
