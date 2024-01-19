## json-odrl-manager

This project is a partial implementation in Node.js dedicated to providing a lightweight solution for managing digital rights within specific scenarios outlined by ODRL, with a focus on JSON format.

### Goals:

- **JSON ODRL Policy Evaluation:** Implementation of an engine capable of interpreting ODRL policies in JSON format to determine the rights associated with a digital resource.

- **JSON Policy Validation:** Feature enabling the validation of ODRL policies in JSON format against the official specification.

- **ContextFetcher Implementation:** Integrate a ContextFetcher to retrieve values for evaluating the `leftOperand` in conditions and refinements of actions.