import { PolicyDataFetcher, Custom } from 'PolicyDataFetcher';
import policyEvaluator, { PolicyEvaluator } from './PolicyEvaluator';
import policyInstanciator, { PolicyInstanciator } from './PolicyInstanciator';
import { ActionType } from 'models/odrl/Action';

export const evaluator: PolicyEvaluator = policyEvaluator;
export const instanciator: PolicyInstanciator = policyInstanciator;
export {
  ActionType,
  PolicyDataFetcher,
  Custom,
  PolicyEvaluator,
  PolicyInstanciator,
};
