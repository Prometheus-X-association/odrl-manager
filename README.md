# json-odrl-manager

json-odrl-manager is a Node.js library designed to facilitate the interpretation and evaluation of ODRL (Open Digital Rights Language) policies in JSON format. The library includes components such as the PolicyInstanciator, PolicyEvaluator and PolicyDataFetcher.

### Objectives:

- **ODRL Policy Interpretation:** The core functionality includes a policy evaluator that interprets ODRL policies expressed in JSON format.

- **Policy Instance Creation:** A policy instanciator facilitates the instantiation of policy objects from JSON representations.

- **Test Suites:** The library includes a comprehensive set of test suites designed to validate the correct functioning of the PolicyEvaluator and PolicyInstanciator components. These tests cover various scenarios to ensure the library's reliability and accuracy.

### Key Components:

- **PolicyEvaluator:** This engine evaluates ODRL policies to determine the digital rights associated with a specific resource. It takes JSON-encoded policies as input and produces authorization decisions. The PolicyEvaluator determines the permissions, prohibitions, and obligations associated with a digital resource based on these policies.

- **PolicyInstanciator:** This component facilitates the creation of policy instances from JSON representations. It allows developers to work with policies in a structured and object-oriented manner, providing a convenient way to interact with policy structures programmatically.

- **PolicyDataFetcher Implementation:** Integration of a PolicyDataFetcher to retrieve values for evaluating the `leftOperand` in conditions and refinements of actions.

### Usage Examples:

The library can be applied to various scenarios, including:

- Interpreting ODRL policies to make access control decisions.
- Programmatically creating and manipulating ODRL policy instances.
- Validating ODRL policies against the official specification.

For detailed examples and code snippets, please refer to the test suites included in the project.

### Keywords:

- ODRL
- Policy Evaluation
- Digital Rights Management
- Authorization
- Access Control
