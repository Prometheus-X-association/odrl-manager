import { IDSAPolicy } from 'policy-helper/interfaces/idsa.policy.interface';
import { parsePolicy } from 'policy-helper/parsers/idsaToJson';

const inputPolicy: IDSAPolicy.IPolicyClass = {
  '@id': 'policy123',
  'odrl:profile': [{ '@id': 'http://example.com/profile1' }],
  'odrl:permission': [
    {
      'odrl:action': IDSAPolicy.Action.Read,
      'odrl:assigner': 'http://example.com/assigner',
      'odrl:assignee': 'http://example.com/assignee',
      'odrl:constraint': [
        {
          'odrl:leftOperand': IDSAPolicy.LeftOperand.Language,
          'odrl:operator': IDSAPolicy.Operator.Equals,
          'odrl:rightOperand': 'en',
        },
      ],
    },
  ],
};
const outputPolicy = parsePolicy(inputPolicy);
console.log(outputPolicy);
