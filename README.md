# json-odrl-manager

**json-odrl-manager** is a Node.js library designed to facilitate the interpretation and evaluation of ODRL (Open Digital Rights Language) policies in JSON format. The library includes components such as the `PolicyInstanciator`, `PolicyEvaluator`, and `PolicyDataFetcher`. It is used in the PDC (PTX DataSpace Connector) to manage ODRL access control and serves as the main component of the PDP.

### Objectives:

1. **ODRL Policy Instantiation:** The project enables the creation of complex ODRL policy objects from JSON representations, adhering as closely as possible to ODRL standards.

2. **Access Control Evaluation:** Once instantiated, policies can be evaluated to determine access rights and authorized actions on specific resources.

3. **Policy Execution:** Instantiated policies are executable, allowing for dynamic application of access control rules in various contexts.

4. **Test Suites:** The library includes a comprehensive set of test suites designed to validate the correct functioning of the PolicyEvaluator and PolicyInstanciator components. These tests cover various scenarios to ensure the library's reliability and accuracy.

### Key Components:

1. **PolicyInstanciator:** Facilitates the creation of complex ODRL policy objects from JSON representations, enabling developers to work with policies in an organized and object-oriented manner while adhering to ODRL standards.

2. **PolicyEvaluator:** An engine that analyzes ODRL policies to determine digital rights for specific resources. It makes authorization decisions by evaluating permissions, prohibitions, and obligations defined in the policies, working in conjunction with the PolicyDataFetcher and PolicyStateFetcher for context-aware evaluations.

3. **PolicyFetcher:** An abstract base class that underpins data retrieval during policy evaluation. It incorporates custom methods, context functions, and a flexible bypass mechanism for certain operations.

4. **PolicyDataFetcher:** Builds on PolicyFetcher to retrieve values needed for evaluating the `leftOperand` in conditions and action refinements. It provides a range of methods for ODRL-specific data points (e.g., dateTime, spatialCoordinates, payAmount) and includes a type system for leftOperands.

5. **PolicyStateFetcher:** Also extends PolicyFetcher to retrieve state-related information necessary for policy evaluation. It generates context functions from class methods and implements state-specific queries such as 'compensate.'

Together, these components form a system for instantiating, evaluating, and executing ODRL policies. The combination of PolicyInstanciator, PolicyEvaluator, and the Fetcher components enables accurate policy interpretation, context-aware evaluation, and dynamic application of access control rules across various scenarios.

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
