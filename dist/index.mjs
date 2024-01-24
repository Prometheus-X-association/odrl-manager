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

// src/EntityRegistry.ts
var _EntityRegistry = class _EntityRegistry {
  static getFetcherFromPolicy(rootUID) {
    const root = _EntityRegistry.entityReferences[rootUID];
    return (root == null ? void 0 : root._fetcherUID) ? _EntityRegistry.entityReferences[root._fetcherUID] : void 0;
  }
  static getEntity(uid) {
    return _EntityRegistry.entityReferences[uid];
  }
  static addReference(model) {
    _EntityRegistry.entityReferences[model._objectUID] = model;
  }
  static cleanReferences() {
    _EntityRegistry.parentRelations = {};
    _EntityRegistry.entityReferences = {};
  }
  static setParent(child, parent) {
    _EntityRegistry.parentRelations[child._objectUID] = parent._objectUID;
  }
  static getParent(child) {
    const uid = _EntityRegistry.parentRelations[child._objectUID];
    return _EntityRegistry.entityReferences[uid];
  }
};
_EntityRegistry.parentRelations = {};
_EntityRegistry.entityReferences = {};
var EntityRegistry = _EntityRegistry;

// src/PolicyDataFetcher.ts
import { randomUUID } from "crypto";
var Custom = () => {
  return (target, key, descriptor) => {
    if (descriptor && typeof descriptor.value === "function") {
      target.customMethods = target.customMethods || [];
      target.customMethods.push(key);
    }
  };
};
var PolicyDataFetcher = class {
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
    this.options = {};
    this._objectUID = randomUUID();
    EntityRegistry.addReference(this);
    const prototype = Object.getPrototypeOf(this);
    const customs = prototype.customMethods || [];
    customs.forEach((method) => {
      const propertyName = method.replace(/^get/, "");
      const lowercasePropertyName = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
      this.context[lowercasePropertyName] = this[method].bind(this);
    });
  }
  setRequestOptions(options) {
    this.options = options;
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

// src/models/ModelBasic.ts
import { randomUUID as randomUUID2 } from "crypto";
var ModelBasic = class _ModelBasic {
  constructor() {
    this._objectUID = randomUUID2();
    EntityRegistry.addReference(this);
  }
  handleFailure() {
    console.log("handleFailure");
  }
  setParent(parent) {
    EntityRegistry.setParent(this, parent);
  }
  getParent() {
    return EntityRegistry.getParent(this);
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
                  if (item instanceof _ModelBasic && typeof item.validate === "function") {
                    item.validate(depth + 2, promises);
                  } else {
                    throw new Error(
                      `Invalid entry: ${JSON.stringify(item, null, 2)}`
                    );
                  }
                }
              } else if (value instanceof _ModelBasic && typeof value.validate === "function") {
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
            if (item instanceof _ModelBasic && typeof item.debug === "function") {
              item.debug(depth + 2);
            } else {
              console.log(
                `\x1B[31m${indentation}    ${JSON.stringify(item)}\x1B[37m`
              );
            }
          }
          console.log(`${indentation}  \x1B[36m]\x1B[37m`);
        } else if (value instanceof _ModelBasic && typeof value.debug === "function") {
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

// src/models/Explorable.ts
var Explorable = class _Explorable extends ModelBasic {
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
  evaluate() {
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
  evaluate() {
    return __async(this, null, function* () {
      const result = yield Promise.all([
        this.evaluateConstraints(),
        this.evaluateDuties()
      ]);
      return result.every(Boolean);
    });
  }
  evaluateDuties() {
    return __async(this, null, function* () {
      try {
        if (this.duty) {
          const all = yield Promise.all(this.duty.map((duty) => duty.evaluate()));
          return all.every(Boolean);
        }
        return true;
      } catch (error) {
        console.error("Error while evaluating rule:", error);
      }
      return false;
    });
  }
  evaluateConstraints() {
    return __async(this, null, function* () {
      try {
        if (this.constraints) {
          const all = yield Promise.all(
            this.constraints.map((constraint) => constraint.evaluate())
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
  addRemedy(duty) {
    if (this.remedy === void 0) {
      this.remedy = [];
    }
    this.remedy.push(duty);
  }
  evaluate() {
    return __async(this, null, function* () {
      const result = yield Promise.all([
        this.evaluateConstraints(),
        this.evaluateRemedies()
      ]);
      return result.every(Boolean);
    });
  }
  evaluateRemedies() {
    return __async(this, null, function* () {
      try {
        if (this.remedy) {
          const all = yield Promise.all(
            this.remedy.map((remedy) => remedy.evaluate())
          );
          return all.every(Boolean);
        }
        return true;
      } catch (error) {
        console.error("Error while evaluating rule:", error);
      }
      return false;
    });
  }
  // Todo: @HandleFailure()
  evaluateConstraints() {
    return __async(this, null, function* () {
      try {
        if (this.constraints) {
          const all = yield Promise.all(
            this.constraints.map((constraint) => constraint.evaluate())
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
var _Action = class _Action extends ModelBasic {
  constructor(value, includedIn) {
    super();
    this.value = value;
    this.includedIn = includedIn;
    _Action.includeIn(value, [this.value]);
  }
  static includeIn(current, values) {
    let inclusions = _Action.inclusions.get(current);
    if (!inclusions) {
      inclusions = /* @__PURE__ */ new Set();
      _Action.inclusions.set(current, inclusions);
    }
    for (let value of values) {
      inclusions.add(value);
    }
  }
  addConstraint(constraint) {
    if (this.refinement === void 0) {
      this.refinement = [];
    }
    this.refinement.push(constraint);
  }
  includes(value) {
    return __async(this, null, function* () {
      var _a;
      return ((_a = _Action.inclusions.get(this.value)) == null ? void 0 : _a.has(value)) || false;
    });
  }
  static getIncluded(values) {
    return __async(this, null, function* () {
      const foundValues = [];
      values.forEach((value) => {
        const includedValues = _Action.inclusions.get(value);
        includedValues && foundValues.push(...Array.from(includedValues));
      });
      return Array.from(new Set(foundValues));
    });
  }
  refine() {
    return __async(this, null, function* () {
      try {
        if (this.refinement) {
          const all = yield Promise.all(
            this.refinement.map((constraint) => constraint.evaluate())
          );
          return all.every(Boolean);
        }
      } catch (error) {
        console.error("Error while refining action:", error);
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
_Action.inclusions = /* @__PURE__ */ new Map();
var Action = _Action;

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
  evaluate() {
    return __async(this, null, function* () {
      const actions2 = this.action;
      if (Array.isArray(actions2)) {
        const processes = yield Promise.all(
          actions2.map((action) => action.refine())
        );
        return processes.every(Boolean);
      }
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

// src/models/odrl/Operator.ts
var _Operator = class _Operator extends ModelBasic {
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
var RightOperand = class extends ModelBasic {
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
var LeftOperand = class extends ModelBasic {
  constructor(value) {
    super();
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  evaluate() {
    return __async(this, null, function* () {
      try {
        const fetcher = this._rootUID ? EntityRegistry.getFetcherFromPolicy(this._rootUID) : void 0;
        if (fetcher) {
          return fetcher.context[this.value]();
        } else {
          console.warn(
            `\x1B[93m/!\\No fetcher found, can't evaluate ${this.value}\x1B[37m`
          );
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
var Constraint = class extends ModelBasic {
  constructor(leftOperand, operator, rightOperand) {
    super();
    this.leftOperand = leftOperand;
    this.operator = operator;
    this.rightOperand = rightOperand;
  }
  evaluate() {
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
  evaluate() {
    return __async(this, null, function* () {
      var _a;
      if (this.leftOperand && this.rightOperand) {
        const leftValue = yield this.leftOperand.evaluate();
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
  evaluate() {
    return __async(this, null, function* () {
      switch (this.operand) {
        case "and":
          return (yield Promise.all(
            this.constraint.map((constraint) => constraint.evaluate())
          )).every((result) => result);
        case "or":
          return (yield Promise.all(
            this.constraint.map((constraint) => constraint.evaluate())
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
  evaluate() {
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
  evaluate() {
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
  evaluate() {
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
var getLastTerm = (input) => {
  const a = input.split("/");
  const b = a.pop();
  return b === "" ? a.pop() : b;
};

// src/PolicyInstanciator.ts
var _PolicyInstanciator = class _PolicyInstanciator {
  constructor() {
    this.policy = null;
    Action.includeIn("use", [
      "Attribution",
      "CommericalUse",
      "DerivativeWorks",
      "Distribution",
      "Notice",
      "Reproduction",
      "ShareAlike",
      "Sharing",
      "SourceCode",
      "acceptTracking",
      "aggregate",
      "annotate",
      "anonymize",
      "archive",
      "attribute",
      "compensate",
      "concurrentUse",
      "delete",
      "derive",
      "digitize",
      "distribute",
      "ensureExclusivity",
      "execute",
      "grantUse",
      "include",
      "index",
      "inform",
      "install",
      "modify",
      "move",
      "nextPolicy",
      "obtainConsent",
      "play",
      "present",
      "print",
      "read",
      "reproduce",
      "reviewPolicy",
      "stream",
      "synchronize",
      "textToSpeech",
      "transform",
      "translate",
      "uninstall",
      "watermark"
    ]);
    Action.includeIn("play", ["display"]);
    Action.includeIn("extract", ["reproduce"]);
    Action.includeIn("transfer", ["give", "sell"]);
  }
  static getInstance() {
    if (!_PolicyInstanciator.instance) {
      _PolicyInstanciator.instance = new _PolicyInstanciator();
    }
    return _PolicyInstanciator.instance;
  }
  static setPermission(element, parent, root) {
    const rule = new RulePermission();
    rule.setParent(parent);
    parent.addPermission(rule);
    return rule;
  }
  static setProhibition(element, parent, root) {
    const rule = new RuleProhibition();
    rule.setParent(parent);
    parent.addProhibition(rule);
    return rule;
  }
  static setObligation(element, parent, root) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    rule.setParent(parent);
    parent.addDuty(rule);
    return rule;
  }
  static setDuty(element, parent, root) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(assigner, assignee);
    rule.setParent(parent);
    parent.addDuty(rule);
    return rule;
  }
  static setAction(element, parent, root, fromArray) {
    try {
      const value = getLastTerm(
        typeof element === "object" ? element.value : element
      );
      if (!value) {
        throw new Error("Invalid action");
      }
      const action = new Action(value, null);
      action.setParent(parent);
      if (!fromArray) {
        parent.setAction(action);
      } else {
        parent.addAction(action);
      }
      return action;
    } catch (error) {
      throw new Error("Action is undefined");
    }
  }
  static setTarget(element, parent, root) {
    const asset = new Asset(element);
    asset.setParent(parent);
    parent.setTarget(asset);
  }
  static setConstraint(element, parent, root) {
    const {
      leftOperand,
      operator: _operator,
      rightOperand,
      constraint: constraints
    } = element;
    const operator = _operator && getLastTerm(_operator);
    const constraint = leftOperand && operator && rightOperand !== void 0 && new AtomicConstraint(
      (() => {
        const _leftOperand = new LeftOperand(leftOperand);
        _leftOperand._rootUID = root == null ? void 0 : root._objectUID;
        return _leftOperand;
      })(),
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
  static setRefinement(element, parent, root) {
    return _PolicyInstanciator.setConstraint(element, parent, root);
  }
  static setConsequence(element, parent, root) {
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
        const policy = new PolicyAgreement(json.uid, context);
        policy.assignee = json.assignee || null;
        policy.assigner = json.assigner || null;
        this.policy = policy;
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
    const instanciate = (property, element, fromArray = false) => {
      try {
        if (element) {
          const child = _PolicyInstanciator.instanciators[property] && (_PolicyInstanciator.instanciators[property].length == 4 && _PolicyInstanciator.instanciators[property](
            element,
            parent,
            this.policy,
            fromArray
          ) || _PolicyInstanciator.instanciators[property](
            element,
            parent,
            this.policy
          ));
          if (typeof element === "object") {
            if (child) {
              this.traverse(element, child);
            } else {
              console.warn(
                `\x1B[93m/!\\Traversal stopped for "${property}".\x1B[37m`
              );
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
          instanciate(property, item, true);
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
      },
      assignee: {
        pick: this.pickAssignedDuty.bind(this),
        type: RuleDuty
      },
      assigner: {
        pick: this.pickEmittedDuty.bind(this),
        type: RuleDuty
      },
      permissionAssignee: {
        pick: this.pickAssignedPermission.bind(this),
        type: RulePermission
      },
      prohibitionAssignee: {
        pick: this.pickAssignedProhibition.bind(this),
        type: RuleProhibition
      },
      agreementAssignee: {
        pick: this.pickAssignedAgreement.bind(this),
        type: PolicyAgreement
      },
      // Pick all duties
      pickAllDuties: {
        pick: this.pickAllDuties.bind(this),
        type: RuleDuty
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
    this.policies = [];
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
  pickEntityFor(entity, explorable, options) {
    if (explorable instanceof RuleDuty || explorable instanceof RulePermission || explorable instanceof RuleProhibition || explorable instanceof PolicyAgreement) {
      const uid = explorable[entity];
      const _uid = options ? options[entity] : void 0;
      return _uid ? uid === _uid : false;
    }
    return false;
  }
  pickEmittedDuty(explorable, options) {
    return this.pickEntityFor("assigner", explorable, options);
  }
  pickAssignedDuty(explorable, options) {
    return this.pickEntityFor("assignee", explorable, options);
  }
  pickAssignedPermission(explorable, options) {
    return this.pickEntityFor("assignee", explorable, options);
  }
  pickAssignedProhibition(explorable, options) {
    return this.pickEntityFor("assignee", explorable, options);
  }
  pickAssignedAgreement(explorable, options) {
    return this.pickEntityFor("assignee", explorable, options);
  }
  pickPermission(explorable, options) {
    console.log("pickPermission");
    return true;
  }
  pickProhibition(explorable, options) {
    console.log("pickProhibition");
    return true;
  }
  pickAllDuties(explorable, options) {
    return explorable instanceof RuleDuty;
  }
  cleanPolicies() {
    this.policies = [];
  }
  addPolicy(policy, fetcher) {
    if (fetcher) {
      policy._fetcherUID = fetcher._objectUID;
    }
    this.policies.push(policy);
  }
  setPolicy(policy, fetcher) {
    this.cleanPolicies();
    this.addPolicy(policy, fetcher);
  }
  logPolicies() {
    this.policies.forEach((policy) => {
      policy.debug();
    });
  }
  setFetcherOptions(options) {
    try {
      if (!this.policies.length) {
        throw new Error(
          "[PolicyDataFetcher/setFetcherOptions]: Policy not found."
        );
      }
      this.policies.forEach((policy) => {
        const fetcher = EntityRegistry.getFetcherFromPolicy(policy._objectUID);
        if (!fetcher) {
          throw new Error(
            "[PolicyDataFetcher/setFetcherOptions]: Fetcher not found."
          );
        } else {
          fetcher.setRequestOptions(options);
        }
      });
    } catch (error) {
      console.warn(`\x1B[93m/!\\${error.message}\x1B[37m`);
    }
  }
  explore(options) {
    return __async(this, null, function* () {
      if (this.policies.length) {
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
  // Todo, include duties processes
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
        actionPromises[action.value].push(parent.evaluate());
      });
      const actions2 = [];
      for (const [action, promises] of Object.entries(actionPromises)) {
        const results = yield Promise.all(promises);
        const isPerformable = results.every((result) => result);
        if (isPerformable) {
          actions2.push(action);
        }
      }
      return Action.getIncluded(actions2);
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
          return (yield action.includes(actionType)) ? acc.concat(yield parent.evaluate()) : acc;
        }),
        Promise.resolve([])
      );
      return results.length ? results.every((result) => result) : defaultResult;
    });
  }
  /**
   * Evaluates the exploitability of listed resources within a set of policies.
   * @param {any} json - JSON representation of policies to be evaluated.
   * @param {boolean} [defaultResult=false] - The default result if no resources are found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the resources are exploitable.
   */
  evalResourcePerformabilities(json, defaultResult = false) {
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
      return results.length ? results.every((result) => result) : defaultResult;
    });
  }
  getDuties() {
    return __async(this, null, function* () {
      return yield this.explore({
        pickAllDuties: true
      });
    });
  }
  getAssignedDuties(assignee) {
    return __async(this, null, function* () {
      return yield this.explore({
        assignee
      });
    });
  }
  getEmittedDuties(assigner) {
    return __async(this, null, function* () {
      return yield this.explore({
        assigner
      });
    });
  }
  /**
   * Evaluates whether the duties related to an assignee are fulfilled.
   * @param {string} assignee - The string value representing the assignee.
   * @param {boolean} [defaultResult=false] - The default result if no duties are found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the duties are fulfilled.
   */
  fulfillDuties(assignee, defaultResult = false) {
    return __async(this, null, function* () {
      this.setFetcherOptions({ assignee });
      const entities = yield this.explore({
        assignee,
        agreementAssignee: assignee,
        permissionAssignee: assignee,
        prohibitionAssignee: assignee
      });
      return this.evalDuties(entities, defaultResult);
    });
  }
  /**
   * Evaluates whether the agreement is fulfilled by the assignee.
   * @param {boolean} [defaultResult=false] - The default result if no duties are found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the agreement is fulfilled.
   */
  evalAgreementForAssignee(assignee, defaultResult = false) {
    return __async(this, null, function* () {
      this.setFetcherOptions({ assignee });
      const entities = (yield this.explore({
        pickAllDuties: true
      })).filter((entity) => !entity.assignee);
      return this.evalDuties(entities, defaultResult);
    });
  }
  /**
   * Evaluates whether certain duties are fulfilled based on the related action conditions.
   * @param {Explorable[]} entities - An array of entities to be explored.
   * @param {boolean} [defaultResult=false] - The default result if no duties are found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the duties are fulfilled.
   */
  evalDuties(entities, defaultResult = false) {
    return __async(this, null, function* () {
      const results = yield entities.reduce(
        (promise, entity) => __async(this, null, function* () {
          const acc = yield promise;
          if (entity instanceof RuleDuty) {
            return acc.concat(yield entity.evaluate());
          }
          return acc;
        }),
        Promise.resolve([])
      );
      return results.length ? results.every((result) => result) : defaultResult;
    });
  }
  // Todo: Retrieve the expected value for a specific duty action
};
var PolicyEvaluator_default = PolicyEvaluator.getInstance();

// src/index.ts
var evaluator = PolicyEvaluator_default;
var instanciator = PolicyInstanciator_default;
export {
  Custom,
  PolicyDataFetcher,
  PolicyEvaluator,
  PolicyInstanciator,
  evaluator,
  instanciator
};
//# sourceMappingURL=index.mjs.map