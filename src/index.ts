import { ContextFetcher, Custom } from 'ContextFetcher';
import policyEvaluator, { PolicyEvaluator } from './PolicyEvaluator';
import policyInstanciator, { PolicyInstanciator } from './PolicyInstanciator';

export const evaluator: PolicyEvaluator = policyEvaluator;
export const instanciator: PolicyInstanciator = policyInstanciator;
export { ContextFetcher, Custom };
