var __getProtoOf = Object.getPrototypeOf;
var __reflectGet = Reflect.get;
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/PolicyEvaluator.ts
var PolicyEvaluator = class _PolicyEvaluator {
  constructor() {
  }
  static getInstance() {
    if (!_PolicyEvaluator.instance) {
      _PolicyEvaluator.instance = new _PolicyEvaluator();
    }
    return _PolicyEvaluator.instance;
  }
  setPolicy(policy) {
  }
  setDataContext(data) {
  }
  visitTarget(target) {
    return __async(this, null, function* () {
    });
  }
};
var PolicyEvaluator_default = PolicyEvaluator.getInstance();

// src/PolicyValidator.ts
var PolicyValidator = class _PolicyValidator {
  //
  validate(depth = 0, validations) {
    validations.push(
      (() => __async(this, null, function* () {
        try {
          validations.push(this.verify());
          for (const prop in this) {
            if (this.hasOwnProperty(prop)) {
              const value = this[prop];
              if (Array.isArray(value)) {
                for (const item of value) {
                  if (item instanceof _PolicyValidator && typeof item.validate === "function") {
                    item.validate(depth + 2, validations);
                  } else {
                    throw new Error(
                      `Invalid entry: ${JSON.stringify(item, null, 2)}`
                    );
                  }
                }
              } else if (value instanceof _PolicyValidator && typeof value.validate === "function") {
                value.validate(depth + 1, validations);
              } else {
                if (typeof value === "object" && value !== null) {
                  throw new Error(
                    `Invalid entry: ${JSON.stringify(value, null, 2)}`
                  );
                }
              }
            }
          }
          return true;
        } catch (error) {
          console.error(`[PolicyValidator] - \x1B[31m${error.message}\x1B[37m`);
          return false;
        }
      }))()
    );
  }
  //
  debug(depth = 0) {
    const indentation = "  ".repeat(depth);
    console.log(
      `\x1B[93m${indentation}Class ${this.constructor.name}:\x1B[37m`
    );
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        const value = this[prop];
        if (Array.isArray(value)) {
          console.log(`${indentation}  ${prop}: \x1B[36m[\x1B[37m`);
          for (const item of value) {
            if (item instanceof _PolicyValidator && typeof item.debug === "function") {
              item.debug(depth + 2);
            } else {
              console.log(
                `\x1B[31m${indentation}    ${JSON.stringify(item)}\x1B[37m`
              );
            }
          }
          console.log(`${indentation}  \x1B[36m]\x1B[37m`);
        } else if (value instanceof _PolicyValidator && typeof value.debug === "function") {
          value.debug(depth + 1);
        } else {
          if (typeof value === "object" && value !== null) {
            console.log(
              `\x1B[31m${indentation}  -${prop}: ${JSON.stringify(
                value
              )}\x1B[37m`
            );
          } else {
            console.log(
              `${indentation}  \x1B[32m-\x1B[37m${prop}: \x1B[90m${value}\x1B[37m`
            );
          }
        }
      }
    }
  }
};

// src/models/Action.ts
var Action = class extends PolicyValidator {
  constructor(value, includedIn) {
    super();
    this.value = value;
    this.includedIn = includedIn;
  }
  addConstraint(constraint) {
    if (this.refinement === void 0) {
      this.refinement = [];
    }
    this.refinement.push(constraint);
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/Asset.ts
var Asset = class extends PolicyValidator {
  constructor(target) {
    super();
    if (typeof target === "string") {
      this.uid = target;
    } else {
      this.uid = target.uid;
      this.partOf = target.partOf;
      this.hasPolicy = target.hasPolicy;
    }
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/Operator.ts
var _Operator = class _Operator extends PolicyValidator {
  constructor(value) {
    super();
    this.value = value;
  }
  verify() {
    return __async(this, null, function* () {
      const isValid = Object.values(_Operator).includes(this.value);
      if (!isValid) {
        throw new Error(`Operator not valid: '${this.value}'`);
      }
      return isValid;
    });
  }
};
_Operator.EQ = "eq";
_Operator.NEQ = "neq";
_Operator.GT = "gt";
_Operator.GEQ = "gteq";
_Operator.LT = "lt";
_Operator.LEQ = "lteq";
_Operator.IN = "isPartOf";
_Operator.HAS_PART = "hasPart";
_Operator.IS_A = "isA";
_Operator.IS_ALL_OF = "isAllOf";
_Operator.IS_ANY_OF = "isAnyOf";
_Operator.IS_NONE_OF = "isNoneOf";
var Operator = _Operator;

// src/models/RightOperand.ts
var RightOperand = class extends PolicyValidator {
  constructor(value) {
    super();
    this.value = value;
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/LeftOperand.ts
var LeftOperand = class extends PolicyValidator {
  constructor(value) {
    super();
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  visit() {
    return __async(this, null, function* () {
      if (this.value === "age") {
        return 21;
      }
      return null;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/Constraint.ts
var Constraint = class extends PolicyValidator {
  constructor(leftOperand, operator, rightOperand) {
    super();
    this.leftOperand = leftOperand;
    this.operator = operator;
    this.rightOperand = rightOperand;
  }
  visit() {
    return __async(this, null, function* () {
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      try {
        const isValid = (this.uid === void 0 || typeof this.uid === "string") && (this.dataType === void 0 || typeof this.dataType === "string") && (this.unit === void 0 || typeof this.unit === "string") && (this.status === void 0 || typeof this.status === "number");
        if (!isValid) {
          throw new Error("Some of your constraint properties are invalid");
        }
        return isValid;
      } catch (error) {
        throw error.message;
      }
    });
  }
};

// src/models/AtomicConstraint.ts
var AtomicConstraint = class _AtomicConstraint extends Constraint {
  constructor(leftOperand, operator, rightOperand) {
    super(leftOperand, operator, rightOperand);
  }
  visit() {
    return __async(this, null, function* () {
      var _a;
      if (this.leftOperand && this.rightOperand) {
        const leftValue = yield this.leftOperand.visit();
        switch ((_a = this.operator) == null ? void 0 : _a.value) {
          case Operator.EQ:
            return leftValue === this.rightOperand;
          case Operator.GT:
            return leftValue > this.rightOperand.value;
          case Operator.LT:
            return leftValue < this.rightOperand.value;
        }
      }
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      const isValid = (yield __superGet(_AtomicConstraint.prototype, this, "verify").call(this)) && this.leftOperand instanceof LeftOperand && this.operator instanceof Operator && this.rightOperand instanceof RightOperand;
      if (!isValid) {
        throw new Error("AtomicConstraint propertie invalid");
      }
      return isValid;
    });
  }
};

// src/models/LogicalConstraint.ts
var _LogicalConstraint = class _LogicalConstraint extends Constraint {
  constructor(operand) {
    super(null, null, null);
    this.operand = operand;
    this.constraint = [];
  }
  addConstraint(constraint) {
    this.constraint.push(constraint);
  }
  // Todo
  visit() {
    return __async(this, null, function* () {
      switch (this.operand) {
        case "and":
          return (yield Promise.all(
            this.constraint.map((constraint) => constraint.visit())
          )).every((result) => result);
        case "or":
          return (yield Promise.all(
            this.constraint.map((constraint) => constraint.visit())
          )).some((result) => result);
        default:
          return false;
      }
    });
  }
  verify() {
    return __async(this, null, function* () {
      const isValid = (yield __superGet(_LogicalConstraint.prototype, this, "verify").call(this)) && this.operand && _LogicalConstraint.operands.includes(this.operand);
      if (!isValid) {
        throw new Error(`LogicalConstraint propertie invalid '${this.operand}'`);
      }
      return isValid;
    });
  }
};
_LogicalConstraint.operands = ["and", "andSequence", "or", "xone"];
var LogicalConstraint = _LogicalConstraint;

// src/PolicyExplorer.ts
var PolicyExplorer = class _PolicyExplorer extends PolicyValidator {
  explore(depth = 0, evaluators) {
    evaluators.push(this.visit());
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        const value = this[prop];
        if (Array.isArray(value)) {
          for (const item of value) {
            if (item instanceof _PolicyExplorer && typeof item.explore === "function") {
              item.explore(depth + 2, evaluators);
            }
          }
        } else if (value instanceof _PolicyExplorer && typeof value.explore === "function") {
          value.explore(depth + 1, evaluators);
        }
      }
    }
  }
};

// src/models/Policy.ts
var Policy = class extends PolicyExplorer {
  constructor(uid, context, type) {
    super();
    this["@context"] = "";
    this["@type"] = type;
    this["@context"] = context;
    this.uid = uid;
    this.permission = [];
    this.prohibition = [];
    this.obligation = [];
  }
  get permissions() {
    return this.permission;
  }
  get prohibitions() {
    return this.prohibition;
  }
  get obligations() {
    return this.permission;
  }
  addPermission(permission) {
    this.permission.push(permission);
  }
  addProhibition(prohibition) {
    this.prohibition.push(prohibition);
  }
  addDuty(prohibition) {
    this.obligation.push(prohibition);
  }
  launchValidation() {
    return __async(this, null, function* () {
      const validations = [];
      this.validate(0, validations);
      return Promise.all(validations).then(
        (results) => results.every((result) => result)
      );
    });
  }
};

// src/models/PolicyAgreement.ts
var PolicyAgreement = class extends Policy {
  constructor(uid, context) {
    super(uid, context, "Agreement");
    this["@type"] = "Agreement";
    this.permission = [];
    this.assigner = null;
    this.assignee = null;
  }
  visit() {
    return __async(this, null, function* () {
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/PolicyOffer.ts
var PolicyOffer = class extends Policy {
  constructor(uid, context) {
    super(uid, context, "Offer");
    this["@type"] = "Offer";
    this.permission = [];
    this.assigner = null;
    this.assignee = null;
  }
  visit() {
    return __async(this, null, function* () {
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/PolicySet.ts
var PolicySet = class extends Policy {
  constructor(uid, context) {
    super(uid, context, "Set");
    this["@type"] = "Set";
    this.permission = [];
  }
  visit() {
    return __async(this, null, function* () {
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/Rule.ts
var Rule = class extends PolicyExplorer {
  constructor(uid) {
    super();
    if (uid) {
      this.uid = uid;
    }
  }
  get constraints() {
    if (this.constraint === void 0) {
      this.constraint = [];
    }
    return this.constraint;
  }
  setTarget(asset) {
    this.target = asset;
  }
  setAction(action) {
    this.action = action;
  }
  addAction(action) {
    if (this.action === void 0) {
      this.action = [];
    }
    this.action.push(action);
  }
  addConstraint(constraint) {
    this.constraints.push(constraint);
  }
  getTarget() {
    return this.target;
  }
  getAction() {
    return this.action;
  }
  getConstraints() {
    return this.constraints;
  }
  visit() {
    return __async(this, null, function* () {
      try {
        if (this.constraints) {
          yield Promise.all(
            this.constraints.map((constraint) => constraint.visit())
          );
        }
        return true;
      } catch (error) {
        console.error("Error while evaluating rule:", error);
        return false;
      }
    });
  }
};

// src/models/RuleDuty.ts
var RuleDuty = class extends Rule {
  constructor(assigner, assignee) {
    super();
    if (assigner) {
      this.assigner = assigner;
    }
    if (assignee) {
      this.assignee = assignee;
    }
  }
  visit() {
    return __async(this, null, function* () {
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
  addConsequence(consequence) {
    if (this.consequence === void 0) {
      this.consequence = [];
    }
    this.consequence.push(consequence);
  }
};

// src/models/RulePermission.ts
var RulePermission = class extends Rule {
  constructor() {
    super();
  }
  addDuty(duty) {
    if (this.duty === void 0) {
      this.duty = [];
    }
    this.duty.push(duty);
  }
  visit() {
    return __async(this, null, function* () {
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/RuleProhibition.ts
var RuleProhibition = class extends Rule {
  constructor() {
    super();
  }
  visit() {
    return __async(this, null, function* () {
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/utils.ts
var copy = (instance, element, attributes = [], mode = 0) => {
  if (instance) {
    let keys = Object.keys(element);
    if (mode !== 0 /* all */) {
      keys = keys.filter((key) => {
        const included = attributes.includes(key);
        return mode === 1 /* exclude */ ? !included : included;
      });
    }
    keys.forEach((key) => {
      if (typeof instance[key] !== "function") {
        instance[key] = element[key];
      }
    });
  }
};

// src/PolicyInstanciator.ts
var _PolicyInstanciator = class _PolicyInstanciator {
  constructor() {
    this.policy = null;
  }
  static getInstance() {
    if (!_PolicyInstanciator.instance) {
      _PolicyInstanciator.instance = new _PolicyInstanciator();
    }
    return _PolicyInstanciator.instance;
  }
  static permission(element, parent) {
    const rule = new RulePermission();
    parent.addPermission(rule);
    return rule;
  }
  static prohibition(element, parent) {
    const rule = new RuleProhibition();
    parent.addProhibition(rule);
    return rule;
  }
  static obligation(element, parent) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    parent.addDuty(rule);
    return rule;
  }
  static duty(element, parent) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    parent.addDuty(rule);
    return rule;
  }
  static action(element, parent) {
    if (typeof element === "object") {
      const action2 = new Action(element.value, null);
      parent.addAction(action2);
      return action2;
    }
    const action = new Action(element, null);
    parent.setAction(action);
    return action;
  }
  static target(element, parent) {
    const asset = new Asset(element);
    parent.setTarget(asset);
  }
  static constraint(element, parent) {
    const {
      leftOperand,
      operator,
      rightOperand,
      constraint: constraints
    } = element;
    const constraint = leftOperand && operator && rightOperand !== void 0 && new AtomicConstraint(
      new LeftOperand(leftOperand),
      new Operator(operator),
      new RightOperand(rightOperand)
    ) || operator && Array.isArray(constraints) && constraints.length > 0 && new LogicalConstraint(operator);
    copy(
      constraint,
      element,
      ["constraint", "leftOperand", "operator", "rightOperand"],
      1 /* exclude */
    );
    parent.addConstraint(constraint || element);
    return constraint;
  }
  static refinement(element, parent) {
    return _PolicyInstanciator.constraint(element, parent);
  }
  static consequence(element, parent) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    copy(
      rule,
      element,
      ["compensatedParty", "compensatingParty"],
      2 /* include */
    );
    parent.addConsequence(rule);
    return rule;
  }
  selectPolicyType(json) {
    const context = json["@context"];
    switch (json["@type"]) {
      case "Offer":
        this.policy = new PolicyOffer(json.uid, context);
        break;
      case "Set":
        this.policy = new PolicySet(json.uid, context);
        break;
      case "Agreement":
        this.policy = new PolicyAgreement(json.uid, context);
        break;
      default:
        throw new Error(`Unknown policy type: ${json["@type"]}`);
    }
  }
  genPolicyFrom(json) {
    this.selectPolicyType(json);
    this.traverse(json, this.policy);
    return this.policy;
  }
  traverse(node, parent) {
    const instanciate = (property, element) => {
      try {
        if (element) {
          const child = _PolicyInstanciator.instanciators[property] && _PolicyInstanciator.instanciators[property](element, parent);
          if (typeof element === "object") {
            if (child) {
              this.traverse(element, child);
            } else {
              console.warn(`Traversal stopped for "${property}".`);
            }
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    for (const property in node) {
      const element = node[property];
      if (Array.isArray(element)) {
        element.forEach((item) => {
          instanciate(property, item);
        });
      } else {
        instanciate(property, element);
      }
    }
  }
};
_PolicyInstanciator.instanciators = {
  permission: _PolicyInstanciator.permission,
  prohibition: _PolicyInstanciator.prohibition,
  obligation: _PolicyInstanciator.obligation,
  duty: _PolicyInstanciator.duty,
  action: _PolicyInstanciator.action,
  target: _PolicyInstanciator.target,
  constraint: _PolicyInstanciator.constraint,
  refinement: _PolicyInstanciator.refinement,
  consequence: _PolicyInstanciator.consequence
};
var PolicyInstanciator = _PolicyInstanciator;
var PolicyInstanciator_default = PolicyInstanciator.getInstance();

// src/index.ts
var evaluator = PolicyEvaluator_default;
var instanciator = PolicyInstanciator_default;
export {
  evaluator,
  instanciator
};
//# sourceMappingURL=index.mjs.map