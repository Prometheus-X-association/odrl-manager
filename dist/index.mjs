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

// src/ContextFetcher.ts
var Custom = () => {
  return (target, key, descriptor) => {
    if (descriptor && typeof descriptor.value === "function") {
      target.customMethods = target.customMethods || [];
      target.customMethods.push(key);
    }
  };
};
var ContextFetcher = class {
  constructor() {
    this.context = {
      absolutePosition: this.getAbsolutePosition.bind(this),
      absoluteSize: this.getAbsoluteSize.bind(this),
      absoluteSpatialPosition: this.getAbsoluteSpatialPosition.bind(this),
      absoluteTemporalPosition: this.getAbsoluteTemporalPosition.bind(this),
      count: this.getCount.bind(this),
      dateTime: this.getDateTime.bind(this),
      delayPeriod: this.getDelayPeriod.bind(this),
      deliveryChannel: this.getDeliveryChannel.bind(this),
      device: this.getDevice.bind(this),
      elapsedTime: this.getElapsedTime.bind(this),
      event: this.getEvent.bind(this),
      fileFormat: this.getFileFormat.bind(this),
      industry: this.getIndustry.bind(this),
      language: this.getLanguage.bind(this),
      media: this.getMedia.bind(this),
      meteredTime: this.getMeteredTime.bind(this),
      payAmount: this.getPayAmount.bind(this),
      percentage: this.getPercentage.bind(this),
      product: this.getProduct.bind(this),
      purpose: this.getPurpose.bind(this),
      recipient: this.getRecipient.bind(this),
      relativePosition: this.getRelativePosition.bind(this),
      relativeSize: this.getRelativeSize.bind(this),
      relativeSpatialPosition: this.getRelativeSpatialPosition.bind(this),
      relativeTemporalPosition: this.getRelativeTemporalPosition.bind(this),
      resolution: this.getResolution.bind(this),
      spatial: this.getSpatial.bind(this),
      spatialCoordinates: this.getSpatialCoordinates.bind(this),
      system: this.getSystem.bind(this),
      systemDevice: this.getSystemDevice.bind(this),
      timeInterval: this.getTimeInterval.bind(this),
      unitOfCount: this.getUnitOfCount.bind(this),
      version: this.getVersion.bind(this),
      virtualLocation: this.getVirtualLocation.bind(this)
    };
    const prototype = Object.getPrototypeOf(this);
    const customs = prototype.customMethods || [];
    customs.forEach((method) => {
      const propertyName = method.replace(/^get/, "");
      const lowercasePropertyName = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
      this.context[lowercasePropertyName] = this[method].bind(this);
    });
  }
  getAbsolutePosition() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getAbsoluteSize() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getAbsoluteSpatialPosition() {
    return __async(this, null, function* () {
      return [0, 0];
    });
  }
  getAbsoluteTemporalPosition() {
    return __async(this, null, function* () {
      return /* @__PURE__ */ new Date();
    });
  }
  getCount() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getDateTime() {
    return __async(this, null, function* () {
      return /* @__PURE__ */ new Date();
    });
  }
  getDelayPeriod() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getDeliveryChannel() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getDevice() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getElapsedTime() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getEvent() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getFileFormat() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getIndustry() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getLanguage() {
    return __async(this, null, function* () {
      return "en";
    });
  }
  getMedia() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getMeteredTime() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getPayAmount() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getPercentage() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getProduct() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getPurpose() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getRecipient() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getRelativePosition() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getRelativeSize() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getRelativeSpatialPosition() {
    return __async(this, null, function* () {
      return [0, 0];
    });
  }
  getRelativeTemporalPosition() {
    return __async(this, null, function* () {
      return /* @__PURE__ */ new Date();
    });
  }
  getResolution() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  getSpatial() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getSpatialCoordinates() {
    return __async(this, null, function* () {
      return [0, 0];
    });
  }
  getSystem() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getSystemDevice() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getTimeInterval() {
    return __async(this, null, function* () {
      const now = /* @__PURE__ */ new Date();
      return [now, now];
    });
  }
  getUnitOfCount() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getVersion() {
    return __async(this, null, function* () {
      return "";
    });
  }
  getVirtualLocation() {
    return __async(this, null, function* () {
      return "";
    });
  }
};

// src/ModelEssential.ts
import { randomUUID } from "crypto";
var _ModelEssential = class _ModelEssential {
  constructor() {
    this._objectUID = randomUUID();
  }
  static setFetcher(fetcher) {
    _ModelEssential.fetcher = fetcher;
  }
  setParent(parent) {
    _ModelEssential.parentRelations[this._objectUID] = parent;
  }
  getParent() {
    return _ModelEssential.parentRelations[this._objectUID];
  }
  //
  validate(depth = 0, promises) {
    promises.push(
      (() => __async(this, null, function* () {
        try {
          promises.push(this.verify());
          for (const prop in this) {
            if (this.hasOwnProperty(prop)) {
              const value = this[prop];
              if (Array.isArray(value)) {
                for (const item of value) {
                  if (item instanceof _ModelEssential && typeof item.validate === "function") {
                    item.validate(depth + 2, promises);
                  } else {
                    throw new Error(
                      `Invalid entry: ${JSON.stringify(item, null, 2)}`
                    );
                  }
                }
              } else if (value instanceof _ModelEssential && typeof value.validate === "function") {
                value.validate(depth + 1, promises);
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
            if (item instanceof _ModelEssential && typeof item.debug === "function") {
              item.debug(depth + 2);
            } else {
              console.log(
                `\x1B[31m${indentation}    ${JSON.stringify(item)}\x1B[37m`
              );
            }
          }
          console.log(`${indentation}  \x1B[36m]\x1B[37m`);
        } else if (value instanceof _ModelEssential && typeof value.debug === "function") {
          value.debug(depth + 1);
        } else {
          if (typeof value === "object" && value !== null) {
            console.log(
              `\x1B[31m${indentation}  -${prop}: ${JSON.stringify(
                value
              )}\x1B[37m`
            );
          } else {
            if (prop !== "_objectUID") {
              console.log(
                `${indentation}  \x1B[32m-\x1B[37m${prop}: \x1B[90m${value}\x1B[37m`
              );
            }
          }
        }
      }
    }
  }
};
_ModelEssential.parentRelations = {};
var ModelEssential = _ModelEssential;

// src/Explorable.ts
var Explorable = class _Explorable extends ModelEssential {
  explore(pick, depth = 0, entities, options) {
    if (pick(this, options)) {
      entities.push(this);
    }
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        const value = this[prop];
        if (Array.isArray(value)) {
          for (const item of value) {
            if (item instanceof _Explorable && typeof item.explore === "function") {
              item.explore(pick, depth + 2, entities, options);
            }
          }
        } else if (value instanceof _Explorable && typeof value.explore === "function") {
          value.explore(pick, depth + 1, entities, options);
        }
      }
    }
  }
};

// src/models/odrl/Asset.ts
var Asset = class extends Explorable {
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
  visit() {
    return __async(this, null, function* () {
      return true;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/odrl/Rule.ts
var Rule = class extends Explorable {
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
};

// src/models/odrl/RulePermission.ts
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
      try {
        if (this.constraints) {
          const all = yield Promise.all(
            this.constraints.map((constraint) => constraint.visit())
          );
          return all.every(Boolean);
        }
      } catch (error) {
        console.error("Error while evaluating rule:", error);
      }
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/odrl/RuleProhibition.ts
var RuleProhibition = class extends Rule {
  constructor() {
    super();
  }
  visit() {
    return __async(this, null, function* () {
      try {
        if (this.constraints) {
          const all = yield Promise.all(
            this.constraints.map((constraint) => constraint.visit())
          );
          if (all.length) {
            return all.every((value) => value === false);
          }
          return false;
        }
      } catch (error) {
        console.error("Error while evaluating rule:", error);
      }
      return false;
    });
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};

// src/models/odrl/Action.ts
var Action = class extends ModelEssential {
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

// src/models/odrl/Operator.ts
var _Operator = class _Operator extends ModelEssential {
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

// src/models/odrl/RightOperand.ts
var RightOperand = class extends ModelEssential {
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

// src/models/odrl/LeftOperand.ts
var LeftOperand = class extends ModelEssential {
  constructor(value) {
    super();
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  visit() {
    return __async(this, null, function* () {
      try {
        if (ModelEssential.fetcher) {
          return ModelEssential.fetcher.context[this.value]();
        }
      } catch (error) {
        console.error(`LeftOperand function ${this.value} not found`);
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

// src/models/odrl/Constraint.ts
var Constraint = class extends ModelEssential {
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

// src/models/odrl/AtomicConstraint.ts
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
            return leftValue === this.rightOperand.value;
          case Operator.NEQ:
            return leftValue !== this.rightOperand.value;
          case Operator.GT:
            return leftValue > this.rightOperand.value;
          case Operator.GEQ:
            return leftValue >= this.rightOperand.value;
          case Operator.LT:
            return leftValue < this.rightOperand.value;
          case Operator.LEQ:
            return leftValue <= this.rightOperand.value;
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

// src/models/odrl/LogicalConstraint.ts
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

// src/models/odrl/Policy.ts
var Policy = class _Policy extends Explorable {
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
  validate() {
    return __async(this, null, function* () {
      const promises = [];
      __superGet(_Policy.prototype, this, "validate").call(this, 0, promises);
      return Promise.all(promises).then(
        (results) => results.every((result) => result)
      );
    });
  }
  explore(picker, options) {
    return __async(this, null, function* () {
      const explorables = [];
      __superGet(_Policy.prototype, this, "explore").call(this, picker, 0, explorables, options);
      return explorables;
    });
  }
};

// src/models/odrl/PolicyAgreement.ts
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

// src/models/odrl/PolicyOffer.ts
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

// src/models/odrl/PolicySet.ts
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

// src/models/odrl/RuleDuty.ts
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
var getLastTerm = (input) => {
  const a = input.split("/");
  const b = a.pop();
  return b === "" ? a.pop() : b;
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
  static setPermission(element, parent) {
    const rule = new RulePermission();
    rule.setParent(parent);
    parent.addPermission(rule);
    return rule;
  }
  static setProhibition(element, parent) {
    const rule = new RuleProhibition();
    rule.setParent(parent);
    parent.addProhibition(rule);
    return rule;
  }
  static setObligation(element, parent) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    rule.setParent(parent);
    parent.addDuty(rule);
    return rule;
  }
  static setDuty(element, parent) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    rule.setParent(parent);
    parent.addDuty(rule);
    return rule;
  }
  static setAction(element, parent) {
    try {
      const value = getLastTerm(
        typeof element === "object" ? element.value : element
      );
      if (!value) {
        throw new Error("Invalid action");
      }
      const action = new Action(value, null);
      action.setParent(parent);
      parent.setAction(action);
      return action;
    } catch (error) {
      throw new Error("Action is undefined");
    }
  }
  static setTarget(element, parent) {
    const asset = new Asset(element);
    asset.setParent(parent);
    parent.setTarget(asset);
  }
  static setConstraint(element, parent) {
    const {
      leftOperand,
      operator: _operator,
      rightOperand,
      constraint: constraints
    } = element;
    const operator = _operator && getLastTerm(_operator);
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
    if (constraint) {
      constraint.setParent(parent);
    }
    parent.addConstraint(constraint || element);
    return constraint;
  }
  static setRefinement(element, parent) {
    return _PolicyInstanciator.setConstraint(element, parent);
  }
  static setConsequence(element, parent) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    copy(
      rule,
      element,
      ["compensatedParty", "compensatingParty"],
      2 /* include */
    );
    rule.setParent(parent);
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
    try {
      this.selectPolicyType(json);
      this.traverse(json, this.policy);
      return this.policy;
    } catch (error) {
      console.error(error.message);
    }
    return null;
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
  permission: _PolicyInstanciator.setPermission,
  prohibition: _PolicyInstanciator.setProhibition,
  obligation: _PolicyInstanciator.setObligation,
  duty: _PolicyInstanciator.setDuty,
  action: _PolicyInstanciator.setAction,
  target: _PolicyInstanciator.setTarget,
  constraint: _PolicyInstanciator.setConstraint,
  refinement: _PolicyInstanciator.setRefinement,
  consequence: _PolicyInstanciator.setConsequence
};
var PolicyInstanciator = _PolicyInstanciator;
var PolicyInstanciator_default = PolicyInstanciator.getInstance();

// src/PolicyEvaluator.ts
var PolicyEvaluator = class _PolicyEvaluator {
  constructor() {
    this.pickers = {
      target: {
        pick: this.pickTarget.bind(this),
        type: Asset
      },
      permission: {
        pick: this.pickPermission.bind(this),
        type: RulePermission
      },
      prohibition: {
        pick: this.pickProhibition.bind(this),
        type: RuleProhibition
      }
    };
    this.pick = (explorable, options) => {
      for (const key in options) {
        if (options.hasOwnProperty(key)) {
          const picker = this.pickers[key];
          if (typeof picker.pick === "function" && explorable instanceof picker.type) {
            const pickable = picker.pick(explorable, options);
            if (pickable) {
              return true;
            }
          }
        }
      }
      return false;
    };
    this.policies = null;
  }
  static getInstance() {
    if (!_PolicyEvaluator.instance) {
      _PolicyEvaluator.instance = new _PolicyEvaluator();
    }
    return _PolicyEvaluator.instance;
  }
  pickTarget(explorable, options) {
    if (explorable instanceof Asset) {
      const uid = explorable.uid;
      const target = options == null ? void 0 : options.target;
      if (typeof target === "object") {
        return target.all || uid === target.uid;
      }
      return uid === target;
    }
    return false;
  }
  pickPermission(explorable, options) {
    console.log("pickPermission");
    return true;
  }
  pickProhibition(explorable, options) {
    console.log("pickProhibition");
    return true;
  }
  cleanPolicies() {
    this.policies = [];
  }
  addPolicy(policy) {
    if (this.policies === null) {
      this.policies = [];
    }
    this.policies.push(policy);
  }
  setPolicy(policy) {
    this.cleanPolicies();
    this.addPolicy(policy);
  }
  logPolicies() {
    var _a;
    if ((_a = this.policies) == null ? void 0 : _a.length) {
      this.policies.forEach((policy) => {
        policy.debug();
      });
    }
  }
  setFetcher(fetcher) {
    ModelEssential.setFetcher(fetcher);
  }
  explore(options) {
    return __async(this, null, function* () {
      if (this.policies && this.policies.length) {
        const explorables = (yield Promise.all(
          this.policies.map(
            (policy) => __async(this, null, function* () {
              return yield policy.explore(this.pick.bind(this), options);
            })
          )
        )).flat();
        return explorables;
      }
      return [];
    });
  }
  /**
   * Retrieves a list of performable actions on the specified target.
   * @param {string} target - A string representing the target.
   * @returns {Promise<string[]>} A promise resolved with an array of performable actions.
   */
  getPerformableActions(target) {
    return __async(this, null, function* () {
      const targets = yield this.explore({
        target
      });
      const actionPromises = {};
      targets.forEach((target2) => {
        const parent = target2.getParent();
        const action = parent.action;
        if (!actionPromises[action.value]) {
          actionPromises[action.value] = [];
        }
        actionPromises[action.value].push(parent.visit());
      });
      const actions = [];
      for (const [action, promises] of Object.entries(actionPromises)) {
        const results = yield Promise.all(promises);
        const isPerformable = results.every((result) => result);
        if (isPerformable) {
          actions.push(action);
        }
      }
      return actions;
    });
  }
  /**
   * Verifies whether a specific action can be performed on a given target.
   * @param {ActionType} actionType - A string representing the type of action.
   * @param {string} target - A string representing the target.
   * @param {boolean} defaultResult - A boolean defining the value to return if no corresponding target is found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating the feasibility of the action.
   */
  isActionPerformable(actionType, target, defaultResult = false) {
    return __async(this, null, function* () {
      const targets = yield this.explore({
        target
      });
      const results = yield targets.reduce(
        (promise, target2) => __async(this, null, function* () {
          const acc = yield promise;
          const parent = target2.getParent();
          const action = parent.action;
          return actionType === (action == null ? void 0 : action.value) ? [...acc, yield parent.visit()] : acc;
        }),
        Promise.resolve([])
      );
      return results.length ? results.every((result) => result) : defaultResult;
    });
  }
  /**
   * Evaluates the exploitability of listed resources within a set of policies.
   * @param {any} json - JSON representation of policies to be evaluated.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the resources are exploitable.
   */
  evalResourcePerformabilities(json) {
    return __async(this, null, function* () {
      const instanciator2 = new PolicyInstanciator();
      instanciator2.genPolicyFrom(json);
      const evaluator2 = new _PolicyEvaluator();
      if (instanciator2.policy) {
        evaluator2.setPolicy(instanciator2.policy);
      }
      const targets = yield evaluator2.explore({
        target: { uid: "", all: true }
      });
      const actionPromises = targets.map(
        (target) => __async(this, null, function* () {
          const parent = target.getParent();
          const actionType = parent.action.value;
          return target.uid ? this.isActionPerformable(actionType, target.uid) : false;
        })
      );
      const results = yield Promise.all(actionPromises);
      return results.every((result) => result);
    });
  }
};
var PolicyEvaluator_default = PolicyEvaluator.getInstance();

// src/index.ts
var evaluator = PolicyEvaluator_default;
var instanciator = PolicyInstanciator_default;
export {
  ContextFetcher,
  Custom,
  PolicyEvaluator,
  PolicyInstanciator,
  evaluator,
  instanciator
};
//# sourceMappingURL=index.mjs.map