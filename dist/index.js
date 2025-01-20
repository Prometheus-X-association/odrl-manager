"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __reflectGet = Reflect.get;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Custom: () => Custom,
  PolicyDataFetcher: () => PolicyDataFetcher,
  PolicyEvaluator: () => PolicyEvaluator,
  PolicyInstanciator: () => PolicyInstanciator,
  PolicyStateFetcher: () => PolicyStateFetcher,
  evaluator: () => evaluator,
  instanciator: () => instanciator
});
module.exports = __toCommonJS(src_exports);

// src/EntityRegistry.ts
var _EntityRegistry = class _EntityRegistry {
  /**
   * Gets the data fetcher associated with a policy
   * @param {string} rootUID - The UID of the root policy
   * @returns {PolicyDataFetcher | undefined} The associated data fetcher or undefined
   */
  static getDataFetcherFromPolicy(rootUID) {
    const root = _EntityRegistry.entityReferences[rootUID];
    return (root == null ? void 0 : root._fetcherUID) ? _EntityRegistry.entityReferences[root._fetcherUID] : void 0;
  }
  /**
   * Gets the state fetcher associated with a policy
   * @param {string} rootUID - The UID of the root policy
   * @returns {PolicyStateFetcher | undefined} The associated state fetcher or undefined
   */
  static getStateFetcherFromPolicy(rootUID) {
    const root = _EntityRegistry.entityReferences[rootUID];
    return (root == null ? void 0 : root._stateFetcherUID) ? _EntityRegistry.entityReferences[root._stateFetcherUID] : void 0;
  }
  /**
   * Gets an entity by its UID
   * @param {string} uid - The UID of the entity to retrieve
   * @returns {any | undefined} The entity or undefined if not found
   */
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
  static addFailure(model) {
    _EntityRegistry.failures.push(model);
  }
  static hasFailed(uid) {
    return _EntityRegistry.failures.some((failure) => {
      const failureWithUid = failure;
      return failureWithUid.uid === uid;
    });
  }
  static resetFailures() {
    _EntityRegistry.failures = [];
  }
};
/**
 * Map of parent-child relationships between entities
 * @private
 */
_EntityRegistry.parentRelations = {};
/**
 * Map of all entity references by their UIDs
 * @private
 */
_EntityRegistry.entityReferences = {};
var EntityRegistry = _EntityRegistry;

// src/PolicyFetcher.ts
var import_node_crypto = require("crypto");
var PolicyFetcher = class {
  constructor() {
    this.bypass = [];
    this._context = {};
    this.options = {};
    this._objectUID = (0, import_node_crypto.randomUUID)();
    EntityRegistry.addReference(this);
    const prototype = Object.getPrototypeOf(this);
    const customs = prototype.customMethods || [];
    customs.forEach((method) => {
      const propertyName = method.replace(/^get/, "");
      const lowercasePropertyName = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
      this._context[lowercasePropertyName] = this[method].bind(this);
    });
  }
  /**
   * Sets options for the policy request
   * @param {any} options - The options to set
   */
  setRequestOptions(options) {
    this.options = options;
  }
  /**
   * Sets the current node being processed
   * @param {ModelBasic} node - The node to set as current
   */
  setCurrentNode(node) {
    this.currentNode = node;
  }
  hasBypassFor(name) {
    return this.bypass.includes(name);
  }
  setBypassFor(name) {
    return this.bypass.push(name);
  }
};

// src/PolicyDataFetcher.ts
var Custom = () => {
  return (target, key, descriptor) => {
    if (descriptor && typeof descriptor.value === "function") {
      target.customMethods = target.customMethods || [];
      target.customMethods.push(key);
    }
  };
};
var PolicyDataFetcher = class extends PolicyFetcher {
  constructor() {
    super();
    this.types = {
      date: [
        "dateTime",
        "absoluteTemporalPosition",
        "relativeTemporalPosition",
        "timeInterval",
        "elapsedTime"
      ]
      // boolean: [''],
    };
    this._context = __spreadValues({
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
    }, this._context);
  }
  /**
   * Gets the types associated with a left operand
   * @param {string} leftOperand - The left operand to get types for
   * @returns {string[]} Array of types
   */
  getTypes(leftOperand) {
    return Object.entries(this.types).flatMap(([key, values]) => values.includes(leftOperand) ? key : []).filter(Boolean);
  }
  /**
   * Gets the context containing left operand functions
   * @returns {LeftOperandFunctions} The left operand functions context
   */
  get context() {
    return this._context;
  }
  /**
   * Gets the absolute position
   * @returns {Promise<number>} The absolute position
   */
  getAbsolutePosition() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the absolute size
   * @returns {Promise<number>} The absolute size
   */
  getAbsoluteSize() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the absolute spatial position
   * @returns {Promise<[number, number]>} The absolute spatial position
   */
  getAbsoluteSpatialPosition() {
    return __async(this, null, function* () {
      return [0, 0];
    });
  }
  /**
   * Gets the absolute temporal position
   * @returns {Promise<Date>} The absolute temporal position
   */
  getAbsoluteTemporalPosition() {
    return __async(this, null, function* () {
      return /* @__PURE__ */ new Date();
    });
  }
  /**
   * Gets the count
   * @returns {Promise<number>} The count
   */
  getCount() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the date and time
   * @returns {Promise<Date>} The date and time
   */
  getDateTime() {
    return __async(this, null, function* () {
      return /* @__PURE__ */ new Date();
    });
  }
  /**
   * Gets the delay period
   * @returns {Promise<number>} The delay period
   */
  getDelayPeriod() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the delivery channel
   * @returns {Promise<string>} The delivery channel
   */
  getDeliveryChannel() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the device
   * @returns {Promise<string>} The device
   */
  getDevice() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the elapsed time
   * @returns {Promise<number>} The elapsed time
   */
  getElapsedTime() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the event
   * @returns {Promise<string>} The event
   */
  getEvent() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the file format
   * @returns {Promise<string>} The file format
   */
  getFileFormat() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the industry
   * @returns {Promise<string>} The industry
   */
  getIndustry() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the language
   * @returns {Promise<string>} The language
   */
  getLanguage() {
    return __async(this, null, function* () {
      return "en";
    });
  }
  /**
   * Gets the media
   * @returns {Promise<string>} The media
   */
  getMedia() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the metered time
   * @returns {Promise<number>} The metered time
   */
  getMeteredTime() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the pay amount
   * @returns {Promise<number>} The pay amount
   */
  getPayAmount() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the percentage
   * @returns {Promise<number>} The percentage
   */
  getPercentage() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the product
   * @returns {Promise<string>} The product
   */
  getProduct() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the purpose
   * @returns {Promise<string>} The purpose
   */
  getPurpose() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the recipient
   * @returns {Promise<string>} The recipient
   */
  getRecipient() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the relative position
   * @returns {Promise<number>} The relative position
   */
  getRelativePosition() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the relative size
   * @returns {Promise<number>} The relative size
   */
  getRelativeSize() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the relative spatial position
   * @returns {Promise<[number, number]>} The relative spatial position
   */
  getRelativeSpatialPosition() {
    return __async(this, null, function* () {
      return [0, 0];
    });
  }
  /**
   * Gets the relative temporal position
   * @returns {Promise<Date>} The relative temporal position
   */
  getRelativeTemporalPosition() {
    return __async(this, null, function* () {
      return /* @__PURE__ */ new Date();
    });
  }
  /**
   * Gets the resolution
   * @returns {Promise<number>} The resolution
   */
  getResolution() {
    return __async(this, null, function* () {
      return 0;
    });
  }
  /**
   * Gets the spatial
   * @returns {Promise<string>} The spatial
   */
  getSpatial() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the spatial coordinates
   * @returns {Promise<[number, number]>} The spatial coordinates
   */
  getSpatialCoordinates() {
    return __async(this, null, function* () {
      return [0, 0];
    });
  }
  /**
   * Gets the system
   * @returns {Promise<string>} The system
   */
  getSystem() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the system device
   * @returns {Promise<string>} The system device
   */
  getSystemDevice() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the time interval
   * @returns {Promise<[Date, Date]>} The time interval
   */
  getTimeInterval() {
    return __async(this, null, function* () {
      const now = /* @__PURE__ */ new Date();
      return [now, now];
    });
  }
  /**
   * Gets the unit of count
   * @returns {Promise<string>} The unit of count
   */
  getUnitOfCount() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the version
   * @returns {Promise<string>} The version
   */
  getVersion() {
    return __async(this, null, function* () {
      return "";
    });
  }
  /**
   * Gets the virtual location
   * @returns {Promise<string>} The virtual location
   */
  getVirtualLocation() {
    return __async(this, null, function* () {
      return "";
    });
  }
};

// src/models/ModelBasic.ts
var import_node_crypto2 = require("crypto");
var HandleFailure = () => {
  return (target, key, descriptor) => {
    if (descriptor && typeof descriptor.value === "function") {
      const originalMethod = descriptor.value;
      descriptor.value = function(...args) {
        return __async(this, null, function* () {
          const result = yield originalMethod.apply(this, args);
          if (this.handleFailure) {
            yield this.handleFailure(result);
          }
          return result;
        });
      };
    }
    return descriptor;
  };
};
var ModelBasic = class _ModelBasic {
  constructor() {
    this._objectUID = (0, import_node_crypto2.randomUUID)();
    EntityRegistry.addReference(this);
  }
  /**
   * Handles the failure state of a model evaluation
   * @param {boolean} result - The result of the evaluation
   * @protected
   */
  handleFailure(result) {
    return __async(this, null, function* () {
      if (this._instanceOf === "AtomicConstraint") {
        const parent = this.getParent();
        if (parent._instanceOf === "RuleProhibition" && result || !result) {
          EntityRegistry.addFailure(this);
        }
      }
    });
  }
  /**
   * Adds an extension to the current target object. An extension is an additional property
   * that can be attached to a policy to extend its functionality as decribed by it's context.
   *
   * @param {Extension} ext - The extension to add, containing a name and a value.
   * @param {string} prefix - The prefix (or context) associated with the extension, used to
   *                          identify the namespace from which the extension originates.
   * @returns {void}
   */
  addExtension(ext, prefix) {
    const { name, value } = ext;
    this[name] = value;
    if (value && typeof value === "object") {
      value._context = prefix;
    }
  }
  /**
   * Sets the parent of this model
   * @param {ModelBasic} parent - The parent model to set
   */
  setParent(parent) {
    EntityRegistry.setParent(this, parent);
  }
  /**
   * Gets the parent of this model
   * @returns {ModelBasic} The parent model
   */
  getParent() {
    return EntityRegistry.getParent(this);
  }
  //
  /**
   * Validates the model and its children recursively
   * @param {number} depth - The current depth in the validation tree
   * @param {Promise<boolean>[]} promises - Array of validation promises
   */
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
                  } else if ((typeof item === "string" || typeof item === "boolean" || item instanceof Date || typeof item === "number") && this._instanceOf === "RightOperand" || prop === "@context" || prop === "_namespace") {
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
          console.error(`[ModelBasic] - \x1B[31m${error.message}\x1B[37m`);
          return false;
        }
      }))()
    );
  }
  //
  /**
   * Outputs a debug representation of the model
   * @param {number} depth - The current depth in the debug tree
   */
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
            } else if ((typeof item === "string" || typeof item === "boolean" || item instanceof Date || typeof item === "number") && this._instanceOf === "RightOperand" || prop === "@context" || prop === "_namespace") {
              console.log(
                `${indentation}    \x1B[90m${JSON.stringify(
                  item,
                  null,
                  2
                ).replace(/\n/gm, `
${indentation}    `)}\x1B[37m`
              );
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
            if (prop !== "_objectUID" && prop !== "_rootUID" && prop !== "_instanceOf") {
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

// src/models/odrl/Policy.ts
var Policy = class _Policy extends Explorable {
  constructor(uid, context, type) {
    super();
    this["@context"] = "";
    this.uid = uid;
    this["@context"] = context;
    this["@type"] = type;
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
    this._instanceOf = "RulePermission";
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
    this._instanceOf = "RuleProhibition";
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

// src/models/odrl/RuleDuty.ts
var RuleDuty = class extends Rule {
  /**
   * Creates an instance of RuleDuty.
   * @param {Party | undefined} assigner - The party assigning the duty
   * @param {Party | undefined} assignee - The party to whom the duty is assigned
   */
  constructor(assigner, assignee) {
    super();
    if (assigner) {
      this.assigner = assigner;
    }
    if (assignee) {
      this.assignee = assignee;
    }
    this._instanceOf = "RuleDuty";
  }
  /**
   * Gets the array of consequence duties associated with this duty
   * @returns {RuleDuty[] | undefined} The array of consequence duties or undefined if none exist
   */
  getConsequence() {
    return this.consequence;
  }
  /**
   * Evaluates the duty by checking its action and constraints
   * @returns {Promise<boolean>} True if the duty is fulfilled, false otherwise
   */
  evaluate() {
    return __async(this, null, function* () {
      const result = yield Promise.all([
        this.evaluateConstraints(),
        this.evaluateActions()
      ]);
      if (result.every(Boolean)) {
        return true;
      }
      return this.evaluateConsequences();
    });
  }
  /**
   * Evaluates the consequences of the duty
   * @returns {Promise<boolean>} True if any consequence is fulfilled, false otherwise
   */
  evaluateConsequences() {
    return __async(this, null, function* () {
      if (!this.consequence || this.consequence.length === 0) {
        return false;
      }
      for (const consequence of this.consequence) {
        const fulfilled = yield consequence.evaluate();
        if (fulfilled) {
          return true;
        }
      }
      return false;
    });
  }
  /**
   * Evaluates the actions of the duty
   * @returns {Promise<boolean>} True if all actions are fulfilled, false otherwise
   */
  evaluateActions() {
    return __async(this, null, function* () {
      if (Array.isArray(this.action)) {
        const processes = yield Promise.all(
          this.action.map((action) => action.refine())
        );
        return processes.every(Boolean);
      } else if (this.action instanceof Action) {
        return this.action.evaluate();
      }
      return false;
    });
  }
  /**
   * Evaluates the constraints of the duty
   * @returns {Promise<boolean>} True if all constraints are fulfilled, false otherwise
   */
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
  /**
   * Verifies that the duty has valid properties
   * @returns {Promise<boolean>} True if the duty is valid, throws an error otherwise
   */
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
  /**
   * Adds a consequence duty to this duty
   * @param {RuleDuty} duty - The consequence duty to add
   */
  addConsequence(duty) {
    if (this.consequence === void 0) {
      this.consequence = [];
    }
    this.consequence.push(duty);
  }
};

// src/models/odrl/Action.ts
var _Action = class _Action extends ModelBasic {
  /**
   * Creates an instance of Action.
   * @param {string} value - The value representing the action
   * @param {Action | null} includedIn - The parent action this action is included in
   */
  constructor(value, includedIn) {
    super();
    this._instanceOf = "Action";
    this.value = value;
    this.includedIn = includedIn;
    _Action.includeIn(value, [this.value]);
  }
  /**
   * Includes a set of values in the inclusions map for a given action
   * @param {string} current - The action to include other values in
   * @param {string[]} values - Array of values to be included in the action
   * @static
   */
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
  /**
   * Adds a constraint to the action's refinement array
   * @param {Constraint} constraint - The constraint to add
   */
  addConstraint(constraint) {
    if (this.refinement === void 0) {
      this.refinement = [];
    }
    this.refinement.push(constraint);
  }
  /**
   * Checks if this action includes another action
   * @param {string} value - The action value to check for inclusion
   * @returns {Promise<boolean>} True if the action includes the value, false otherwise
   */
  includes(value) {
    return __async(this, null, function* () {
      var _a;
      return ((_a = _Action.inclusions.get(this.value)) == null ? void 0 : _a.has(value)) || false;
    });
  }
  /**
   * Gets all actions included in the given action values
   * @param {ActionType[]} values - Array of action types to get inclusions for
   * @returns {Promise<ActionType[]>} Array of included action types
   * @static
   */
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
  /**
   * Evaluates the action by checking refinements and state fetcher context
   * @returns {Promise<boolean>} True if the action evaluation succeeds, false otherwise
   */
  evaluate() {
    return __async(this, null, function* () {
      const refine = this.refine();
      const rule = this.getParent();
      if (rule instanceof RuleDuty) {
        const all = yield Promise.all([
          refine,
          (() => __async(this, null, function* () {
            try {
              const fetcher = this._rootUID ? EntityRegistry.getStateFetcherFromPolicy(this._rootUID) : void 0;
              if (fetcher) {
                return fetcher.context[this.value]();
              } else {
                console.warn(
                  `\x1B[93m/!\\No state fetcher found, can't evaluate "${this.value}" action\x1B[37m`
                );
              }
            } catch (error) {
              console.error(`No state found for "${this.value}" action`);
            }
            return false;
          }))()
        ]);
        return all.every(Boolean);
      }
      return refine;
    });
  }
  /**
   * Refines the action by evaluating all its refinement constraints
   * @returns {Promise<boolean>} True if all refinements evaluate successfully, false otherwise
   */
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
      return true;
    });
  }
  /**
   * Verifies the action
   * @returns {Promise<boolean>} Always returns true
   */
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
};
/**
 * Map storing action inclusions relationships
 * @private
 */
_Action.inclusions = /* @__PURE__ */ new Map();
var Action = _Action;

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
_Operator.GTEQ = "gteq";
_Operator.LT = "lt";
_Operator.LTEQ = "lteq";
_Operator.IS_PART_OF = "isPartOf";
_Operator.HAS_PART = "hasPart";
_Operator.IS_A = "isA";
_Operator.IS_ALL_OF = "isAllOf";
_Operator.IS_ANY_OF = "isAnyOf";
_Operator.IS_NONE_OF = "isNoneOf";
_Operator.NE = "ne";
_Operator.GTE = "gte";
_Operator.LTE = "lte";
var Operator = _Operator;

// src/models/odrl/RightOperand.ts
var RightOperand = class extends ModelBasic {
  constructor(value) {
    super();
    this._instanceOf = "RightOperand";
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
  /**
   * Creates an instance of LeftOperand
   * @param {string} value - The value to be assigned to the left operand
   */
  constructor(value) {
    super();
    this.value = value;
  }
  /**
   * Gets the value of the left operand
   * @returns {string} The value of the left operand
   */
  getValue() {
    return this.value;
  }
  /**
   * Evaluates the left operand by fetching and processing its value
   * @returns {Promise<[string | number, string[]] | null>} A tuple containing the evaluated value and its types, or null if evaluation fails
   */
  evaluate() {
    return __async(this, null, function* () {
      try {
        const fetcher = this._rootUID ? EntityRegistry.getDataFetcherFromPolicy(this._rootUID) : void 0;
        if (fetcher) {
          const _value = this.value.charAt(0).toLowerCase() + this.value.slice(1);
          const types = fetcher.getTypes(_value);
          fetcher.setCurrentNode(this.getParent());
          const value = yield fetcher.context[_value]();
          if (types.length && types.includes("date")) {
            const dateTime = new Date(value).getTime();
            if (isNaN(dateTime)) {
              console.warn(
                `\x1B[93m/!\\"${value}" is not a supported Date\x1B[37m`
              );
            }
            return [dateTime, types];
          }
          return [value, types];
        } else {
          console.warn(
            `\x1B[93m/!\\No data fetcher found, can't evaluate "${this.value}"\x1B[37m`
          );
        }
      } catch (error) {
        console.error(`LeftOperand function "${this.value}" not found`);
      }
      return null;
    });
  }
  /**
   * Verifies the left operand
   * @returns {Promise<boolean>} Always returns true
   */
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
var _AtomicConstraint = class _AtomicConstraint extends Constraint {
  /**
   * Creates an instance of AtomicConstraint.
   * @param {LeftOperand} leftOperand - The left operand of the constraint
   * @param {Operator} operator - The operator to apply between operands
   * @param {RightOperand} rightOperand - The right operand of the constraint
   */
  constructor(leftOperand, operator, rightOperand) {
    super(leftOperand, operator, rightOperand);
    this._instanceOf = "AtomicConstraint";
  }
  evaluate() {
    return __async(this, null, function* () {
      if (this.leftOperand && this.rightOperand) {
        const fetcher = this.leftOperand._rootUID ? EntityRegistry.getDataFetcherFromPolicy(this.leftOperand._rootUID) : void 0;
        if (fetcher) {
          const bypass = fetcher.hasBypassFor(this.leftOperand.getValue());
          if (bypass) {
            return true;
          }
        }
        const evaluation = yield this.leftOperand.evaluate();
        if (evaluation) {
          const [leftValue, types] = evaluation;
          let rightValue = this.rightOperand.value;
          if (types && types.includes("date") && !Array.isArray(rightValue)) {
            rightValue = new Date(rightValue).getTime();
            if (isNaN(rightValue)) {
              console.warn(
                `\x1B[93m/!\\"${rightValue}" is not a supported Date\x1B[37m`
              );
            }
          }
          const evalOperator = () => {
            var _a;
            switch ((_a = this.operator) == null ? void 0 : _a.value) {
              case Operator.EQ:
                return leftValue === rightValue;
              case Operator.NE:
              case Operator.NEQ:
                return leftValue !== rightValue;
              case Operator.GT:
                return leftValue > rightValue;
              case Operator.GTE:
              case Operator.GTEQ:
                return leftValue >= rightValue;
              case Operator.LT:
                return leftValue < rightValue;
              case Operator.LTE:
              case Operator.LTEQ:
                return leftValue <= rightValue;
              case Operator.IS_NONE_OF:
                return Array.isArray(rightValue) && !rightValue.includes(leftValue);
              case Operator.IS_A:
                return _AtomicConstraint.isA(leftValue, rightValue);
              default:
                return false;
            }
          };
          return evalOperator();
        }
      }
      return false;
    });
  }
  /**
   * Verifies that the atomic constraint has valid operands and operator
   * @returns {Promise<boolean>} True if the constraint is valid, throws an error otherwise
   */
  verify() {
    return __async(this, null, function* () {
      const isValid = (yield __superGet(_AtomicConstraint.prototype, this, "verify").call(this)) && this.leftOperand instanceof LeftOperand && this.operator instanceof Operator && this.rightOperand instanceof RightOperand;
      if (!isValid) {
        throw new Error("AtomicConstraint propertie invalid");
      }
      return isValid;
    });
  }
  static isA(leftValue, rightValue) {
    const type = typeof leftValue;
    const value = typeof rightValue === "string" ? rightValue.toLowerCase() : "";
    switch (value) {
      case "string":
        return type === "string";
      case "number":
        return type === "number";
      case "boolean":
        return type === "boolean";
      case "object":
        return leftValue !== null && type === "object";
      case "array":
        return Array.isArray(leftValue);
      case "date":
        return leftValue instanceof Date;
      case "required":
        return leftValue !== null && leftValue !== void 0 && leftValue !== "" && leftValue !== 0 && leftValue !== false;
      default:
        return false;
    }
  }
};
__decorateClass([
  HandleFailure()
], _AtomicConstraint.prototype, "evaluate", 1);
var AtomicConstraint = _AtomicConstraint;

// src/models/odrl/LogicalConstraint.ts
var _LogicalConstraint = class _LogicalConstraint extends Constraint {
  /**
   * Creates an instance of LogicalConstraint
   * @param {string} operand - The logical operand to be used ('and', 'andSequence', 'or', 'xone')
   */
  constructor(operand) {
    super(null, null, null);
    this._instanceOf = "LogicalConstraint";
    this.operand = operand;
    this.constraint = [];
  }
  /**
   * Adds a constraint to the logical constraint's collection
   * @param {Constraint} constraint - The constraint to add
   */
  addConstraint(constraint) {
    this.constraint.push(constraint);
  }
  /**
   * Evaluates the logical constraint based on its operand type
   * @returns {Promise<boolean>} The result of evaluating all child constraints combined with the logical operand
   */
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
  /**
   * Verifies that the logical constraint is valid
   * @returns {Promise<boolean>} True if the constraint is valid, throws an error otherwise
   */
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

// src/models/odrl/PolicyAgreement.ts
var PolicyAgreement = class extends Policy {
  constructor(uid, context) {
    super(uid, context, "Agreement");
    this["@type"] = "Agreement";
    this.permission = [];
  }
  setAssigner(assigner) {
    this.assigner = assigner;
  }
  setAssignee(assignee) {
    this.assignee = assignee;
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
        const included = attributes.some((attr) => {
          if (attr.startsWith("/") && attr.endsWith("/")) {
            const regex = new RegExp(attr.slice(1, -1));
            return regex.test(key);
          } else {
            return attr === key;
          }
        });
        return mode === 1 /* exclude */ ? !included : included;
      });
    }
    keys.forEach((key) => {
      if (typeof element[key] !== "function") {
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
var getNode = (obj, path) => {
  return path && path.split(".").reduce(
    (acc, key) => acc && acc[key] !== void 0 ? acc[key] : void 0,
    obj
  );
};
var getDurationMatching = (isoDurationString) => {
  const durationRegex = /^P(?!$)(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?=\d)(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
  return durationRegex.exec(isoDurationString);
};
var parseISODuration = (isoDurationString, match) => {
  if (!match) {
    match = getDurationMatching(isoDurationString);
  }
  if (!match) {
    throw new Error(`Invalid ISO 8601 duration format: ${isoDurationString}`);
  }
  const [, years, months, weeks, days, hours, minutes, seconds] = match.map(
    (v) => v ? parseFloat(v) : 0
  );
  let totalMilliseconds = 0;
  if (years) {
    totalMilliseconds += years * 365.25 * 24 * 60 * 60 * 1e3;
  }
  if (months) {
    totalMilliseconds += months * 30.44 * 24 * 60 * 60 * 1e3;
  }
  if (weeks) {
    totalMilliseconds += weeks * 7 * 24 * 60 * 60 * 1e3;
  }
  if (days) {
    totalMilliseconds += days * 24 * 60 * 60 * 1e3;
  }
  if (hours) {
    totalMilliseconds += hours * 60 * 60 * 1e3;
  }
  if (minutes) {
    totalMilliseconds += minutes * 60 * 1e3;
  }
  if (seconds) {
    totalMilliseconds += seconds * 1e3;
  }
  if (totalMilliseconds === 0) {
    throw new Error(
      `No valid duration components found in: ${isoDurationString}`
    );
  }
  return totalMilliseconds;
};

// src/models/odrl/Party.ts
var Party = class extends ModelBasic {
  constructor(uid) {
    super();
    this.uid = uid;
  }
  verify() {
    return __async(this, null, function* () {
      return true;
    });
  }
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
  /**
   * Sets a permission rule on the policy
   * @param {any} element - The permission element data
   * @param {Policy} parent - The parent policy
   * @param {Policy | null} root - The root policy
   * @returns {RulePermission} The created permission rule
   */
  static setPermission(element, parent, root) {
    const { assigner, assignee } = element;
    const rule = new RulePermission();
    if (assigner)
      rule.assigner = new Party(assigner);
    if (assignee)
      rule.assignee = new Party(assignee);
    rule.setParent(parent);
    parent.addPermission(rule);
    return rule;
  }
  /**
   * Sets a prohibition rule on the policy
   * @param {any} element - The prohibition element data
   * @param {Policy} parent - The parent policy
   * @param {Policy | null} root - The root policy
   * @returns {RuleProhibition} The created prohibition rule
   */
  static setProhibition(element, parent, root) {
    const { assigner, assignee } = element;
    const rule = new RuleProhibition();
    if (assigner)
      rule.assigner = new Party(assigner);
    if (assignee)
      rule.assignee = new Party(assignee);
    rule.setParent(parent);
    parent.addProhibition(rule);
    return rule;
  }
  /**
   * Sets an obligation rule on the policy
   * @param {any} element - The obligation element data
   * @param {Policy} parent - The parent policy
   * @param {Policy | null} root - The root policy
   * @returns {RuleDuty} The created obligation rule
   */
  static setObligation(element, parent, root) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(
      assigner && new Party(assigner),
      assignee && new Party(assignee)
    );
    rule.setParent(parent);
    rule._type = "obligation";
    parent.addDuty(rule);
    return rule;
  }
  /**
   * Sets a duty rule on a permission
   * @param {any} element - The duty element data
   * @param {RulePermission} parent - The parent permission
   * @param {Policy | null} root - The root policy
   * @returns {RuleDuty} The created duty rule
   */
  static setDuty(element, parent, root) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(
      assigner && new Party(assigner),
      assignee && new Party(assignee)
    );
    rule.setParent(parent);
    rule._type = "duty";
    parent.addDuty(rule);
    return rule;
  }
  /**
   * Sets an action on a rule
   * @param {string | any} element - The action element data
   * @param {Rule} parent - The parent rule
   * @param {Policy | null} root - The root policy
   * @param {boolean} [fromArray] - Whether the action comes from an array
   * @returns {Action} The created action
   */
  static setAction(element, parent, root, fromArray) {
    try {
      const value = getLastTerm(
        typeof element === "object" ? element.value : element
      );
      if (!value) {
        throw new Error("Invalid action");
      }
      const action = _PolicyInstanciator.construct(Action, value, null);
      action._rootUID = root == null ? void 0 : root._objectUID;
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
  /**
   * Sets a target on a rule
   * @param {any} element - The target element data
   * @param {Rule} parent - The parent rule
   * @param {Policy | null} root - The root policy
   */
  static setTarget(element, parent, root) {
    const asset = new Asset(element);
    asset.setParent(parent);
    parent.setTarget(asset);
  }
  /**
   * Sets a constraint on a parent element
   * @param {any} element - The constraint element data
   * @param {LogicalConstraint | Rule | Action} parent - The parent element
   * @param {Policy | null} root - The root policy
   * @returns {Constraint} The created constraint
   */
  static setConstraint(element, parent, root) {
    var _a;
    const {
      leftOperand,
      operator: _operator,
      rightOperand,
      constraint: constraints
    } = element;
    let _rightOperand = rightOperand;
    const match = getDurationMatching(rightOperand);
    if (match) {
      _rightOperand = parseISODuration(rightOperand);
    }
    const operator = _operator && getLastTerm(_operator);
    const constraint = (_a = leftOperand && operator && _rightOperand !== void 0 && (() => {
      const _leftOperand = new LeftOperand(leftOperand);
      _leftOperand._rootUID = root == null ? void 0 : root._objectUID;
      const constraint2 = new AtomicConstraint(
        _leftOperand,
        new Operator(operator),
        _PolicyInstanciator.construct(RightOperand, _rightOperand)
      );
      _leftOperand.setParent(constraint2);
      return constraint2;
    })()) != null ? _a : operator && Array.isArray(constraints) && constraints.length > 0 && new LogicalConstraint(operator);
    copy(
      constraint,
      element,
      [
        "constraint",
        "leftOperand",
        "operator",
        "rightOperand",
        "/^[^:]+:[^:]+$/"
      ],
      1 /* exclude */
    );
    if (constraint) {
      constraint.setParent(parent);
    }
    parent.addConstraint(constraint || element);
    return constraint;
  }
  /**
   * Sets a refinement on an action
   * @param {any} element - The refinement element data
   * @param {Action} parent - The parent action
   * @param {Policy | null} root - The root policy
   * @returns {Constraint} The created refinement constraint
   */
  static setRefinement(element, parent, root) {
    return _PolicyInstanciator.setConstraint(element, parent, root);
  }
  /**
   * Sets a remedy on a prohibition rule
   * @param {any} element - The remedy element data
   * @param {RuleProhibition} parent - The parent prohibition
   * @param {Policy | null} root - The root policy
   * @returns {RuleDuty} The created remedy rule
   */
  static setRemedy(element, parent, root) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(
      assigner && new Party(assigner),
      assignee && new Party(assignee)
    );
    rule.setParent(parent);
    rule._type = "remedy";
    parent.addRemedy(rule);
    return rule;
  }
  /**
   * Sets a consequence on a duty rule
   * @param {any} element - The consequence element data
   * @param {RuleDuty} parent - The parent duty
   * @param {Policy | null} root - The root policy
   * @returns {RuleDuty} The created consequence rule
   */
  static setConsequence(element, parent, root) {
    const { assigner, assignee } = element;
    const rule = new RuleDuty(
      assigner && new Party(assigner),
      assignee && new Party(assignee)
    );
    copy(
      rule,
      element,
      ["compensatedParty", "compensatingParty"],
      2 /* include */
    );
    rule.setParent(parent);
    rule._type = "consequence";
    parent.addConsequence(rule);
    return rule;
  }
  /**
   * Selects and instantiates the appropriate policy type based on the input JSON
   * @param {any} json - The input policy JSON
   */
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
        policy.setAssignee(json.assignee && new Party(json.assignee));
        policy.setAssigner(json.assigner && new Party(json.assigner));
        this.policy = policy;
        break;
      default:
        throw new Error(`Unknown policy type: ${json["@type"]}`);
    }
  }
  /**
   * Generates a policy from input JSON data
   * @param {any} json - The input policy JSON
   * @param {PolicyNamespace} [policyNamespace] - Optional policy namespace
   * @returns {Policy | null} The generated policy or null if generation fails
   */
  genPolicyFrom(json, policyNamespace) {
    try {
      if (!json) {
        throw new Error("Input JSON is required");
      }
      const parsedJson = policyNamespace ? policyNamespace.parse(json) : json;
      this.selectPolicyType(parsedJson);
      this.traverse(parsedJson, this.policy);
      return this.policy;
    } catch (error) {
      console.error(
        "Error generating policy:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return null;
    }
  }
  /**
   * Adds a namespace instantiator
   * @param {Namespace} namespace - The namespace to add
   */
  static addNamespaceInstanciator(namespace) {
    this.namespaces[namespace.uri] = namespace;
  }
  /**
   * Handles namespace attributes during policy traversal
   * @param {string} attribute - The attribute name
   * @param {any} element - The element data
   * @param {ModelBasic} parent - The parent model
   * @param {Policy | null} root - The root policy
   * @param {boolean} [fromArray] - Whether the element comes from an array
   * @returns {ModelBasic | null | unknown} The created model or null
   */
  static handleNamespaceAttribute(attribute, element, parent, root, fromArray = false) {
    var _a, _b;
    const context = (_b = (_a = this.instance) == null ? void 0 : _a.policy) == null ? void 0 : _b["@context"];
    const isContextArray = Array.isArray(context);
    if (isContextArray && typeof attribute === "string" && /^[\w-]+:[\w-]+$/.test(attribute)) {
      const [prefix, attr] = attribute.split(":");
      const ctx = context.find((c) => c[prefix]);
      if (ctx) {
        const namespaceUri = ctx[prefix];
        const namespace = this.namespaces[namespaceUri];
        if (namespace) {
          const ext = namespace.instanciateProperty(
            attr,
            element,
            parent,
            root,
            fromArray
          );
          if (ext) {
            parent.addExtension(ext, prefix);
          }
          return ext;
        }
      }
    }
    return null;
  }
  /**
   * Traverses the policy tree and instantiates elements
   * @param {any} node - The current node
   * @param {any} parent - The parent node
   */
  traverse(node, parent) {
    const instanciate = (property, element, fromArray = false) => {
      try {
        if (element) {
          const child = _PolicyInstanciator.handleNamespaceAttribute(
            property,
            element,
            parent,
            this.policy,
            fromArray
          ) || _PolicyInstanciator.instanciators[property] && (_PolicyInstanciator.instanciators[property].length == 4 && _PolicyInstanciator.instanciators[property](
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
            } else if (property !== "@context") {
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
  /**
   * Constructs a new instance of a type with namespace handling
   * @param {new (...args: any[]) => T} Type - The type constructor
   * @param {...any[]} args - Constructor arguments
   * @returns {T} The constructed instance
   */
  static construct(Type, ...args) {
    var _a, _b;
    const context = (_b = (_a = this.instance) == null ? void 0 : _a.policy) == null ? void 0 : _b["@context"];
    const isContextArray = Array.isArray(context);
    if (!isContextArray) {
      return Reflect.construct(Type, args);
    }
    const _namespace = [];
    args = args.map((arg) => {
      if (typeof arg === "string" && /^[\w-]+:[\w-]+$/.test(arg)) {
        const [prefix, value] = arg.split(":");
        const ctx = context.find((c) => c[prefix]);
        if (ctx) {
          _namespace.push(prefix);
          return value;
        }
      }
      return arg;
    });
    const instance = Reflect.construct(Type, args);
    instance._namespace = _namespace;
    return instance;
  }
};
_PolicyInstanciator.namespaces = {};
_PolicyInstanciator.instanciators = {
  permission: _PolicyInstanciator.setPermission,
  prohibition: _PolicyInstanciator.setProhibition,
  obligation: _PolicyInstanciator.setObligation,
  duty: _PolicyInstanciator.setDuty,
  action: _PolicyInstanciator.setAction,
  target: _PolicyInstanciator.setTarget,
  constraint: _PolicyInstanciator.setConstraint,
  refinement: _PolicyInstanciator.setRefinement,
  consequence: _PolicyInstanciator.setConsequence,
  remedy: _PolicyInstanciator.setRemedy
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
      pickDuties: {
        pick: this.pickDuties.bind(this),
        type: RuleDuty
      }
    };
    /**
     * Generic picking function that applies the appropriate picker based on options.
     * @param explorable The explorable object to evaluate
     * @param options Configuration object determining which picker to use
     * @returns boolean indicating if the explorable should be picked
     */
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
  /**
   * Filters and captures target explorables based on their unique identifiers.
   * @param explorable The explorable object to evaluate
   * @param options Optional configuration object that may contain target criteria
   * @returns boolean indicating if the explorable should be picked
   */
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
  /**
   * Filters entities based on a specific option key and corresponding payload.
   * @param optionKey The key to check in the options object
   * @param explorable The explorable object to evaluate
   * @param options Configuration object containing filtering criteria
   * @returns boolean indicating if the entity should be picked
   */
  pickEntityFor(optionKey, explorable, options) {
    const payload = options[optionKey];
    if (payload && explorable instanceof RuleDuty || explorable instanceof RulePermission || explorable instanceof RuleProhibition || explorable instanceof PolicyAgreement) {
      const uid = getNode(explorable, payload.uidPath);
      return uid && uid === payload.uidValue;
    }
    return false;
  }
  /**
   * Filters duties emitted by a specific assigner.
   * @param explorable The explorable object to evaluate
   * @param options Optional configuration object that may contain assigner criteria
   * @returns boolean indicating if the duty should be picked
   */
  pickEmittedDuty(explorable, options) {
    return this.pickEntityFor("assigner", explorable, options);
  }
  /**
   * Filters duties assigned to a specific assignee.
   * @param explorable The explorable object to evaluate
   * @param options Optional configuration object that may contain assignee criteria
   * @returns boolean indicating if the duty should be picked
   */
  pickAssignedDuty(explorable, options) {
    return this.pickEntityFor("assignee", explorable, options);
  }
  /**
   * Filters permission rules.
   * @param explorable The explorable object to evaluate
   * @param options Optional configuration object for permission filtering
   * @returns boolean indicating if the permission should be picked
   */
  pickPermission(explorable, options) {
    console.log("pickPermission");
    return true;
  }
  /**
   * Filters prohibition rules.
   * @param explorable The explorable object to evaluate
   * @param options Optional configuration object for prohibition filtering
   * @returns boolean indicating if the prohibition should be picked
   */
  pickProhibition(explorable, options) {
    console.log("pickProhibition");
    return true;
  }
  /**
   * Filters duties based on their type and configuration.
   * @param explorable The explorable object to evaluate
   * @param options Optional configuration object for duty filtering
   * @returns boolean indicating if the duty should be picked
   */
  pickDuties(explorable, options) {
    const isRuleDuty = explorable instanceof RuleDuty;
    if (isRuleDuty) {
      const pickable = (options == null ? void 0 : options.all) === true || explorable._type !== "consequence" && explorable._type !== "remedy";
      return pickable;
    }
    return false;
  }
  /**
   * Sets fetcher options for all policies.
   * @param options Configuration object to be set on the fetchers
   */
  setFetcherOptions(options) {
    try {
      if (!this.policies.length) {
        throw new Error(
          "[PolicyDataFetcher/setFetcherOptions]: Policy not found."
        );
      }
      this.policies.forEach((policy) => {
        const fetcher = EntityRegistry.getDataFetcherFromPolicy(
          policy._objectUID
        );
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
  /**
   * Explores all policies and collects matching explorables based on picker criteria.
   * @param options Configuration object for exploration
   * @returns Promise resolving to array of matched explorables
   */
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
   * Creates a payload object for assignee-based duty filtering.
   * @param assignee The assignee identifier
   * @returns A DutyOptionPayload configured for assignee filtering
   * @private
   */
  static getAssigneePayload(assignee) {
    const payload = {
      propertyName: "assignee",
      uidPath: "assignee.uid",
      uidValue: assignee
    };
    return payload;
  }
  /**
   * Creates a payload object for assigner-based duty filtering.
   * @param assigner The assigner identifier
   * @returns A DutyOptionPayload configured for assigner filtering
   * @private
   */
  static getAssignerPayload(assigner) {
    const payload = {
      propertyName: "assigner",
      uidPath: "assigner.uid",
      uidValue: assigner
    };
    return payload;
  }
  /**
   * Traverses up the node hierarchy to find the first assigner UID.
   * @param node The starting node to search from
   * @returns The first found assigner UID or undefined if none found
   * @public
   */
  static findAssigner(node) {
    var _a;
    let currentNode = node;
    while (currentNode) {
      if ((_a = currentNode.assigner) == null ? void 0 : _a.uid) {
        return currentNode.assigner.uid;
      }
      currentNode = currentNode.getParent();
    }
    return void 0;
  }
  /**
   * Clears all policies from the evaluator.
   * @public
   */
  cleanPolicies() {
    this.policies = [];
  }
  /**
   * Adds a policy to the evaluator with optional data and state fetchers.
   * @param policy The policy to add
   * @param dataFetcher Optional data fetcher to associate with the policy
   * @param stateFetcher Optional state fetcher to associate with the policy
   * @public
   */
  addPolicy(policy, dataFetcher, stateFetcher) {
    if (dataFetcher) {
      policy._fetcherUID = dataFetcher._objectUID;
    }
    if (stateFetcher) {
      policy._stateFetcherUID = stateFetcher._objectUID;
    }
    this.policies.push(policy);
  }
  /**
   * Replaces all existing policies with a single new policy.
   * @param policy The policy to set
   * @param dataFetcher Optional data fetcher to associate with the policy
   * @param stateFetcher Optional state fetcher to associate with the policy
   * @public
   */
  setPolicy(policy, dataFetcher, stateFetcher) {
    this.cleanPolicies();
    this.addPolicy(policy, dataFetcher, stateFetcher);
  }
  /**
   * Debugs all policies in the evaluator by printing their structure.
   * @public
   */
  logPolicies() {
    this.policies.forEach((policy) => {
      policy.debug();
    });
  }
  /**
   * Checks if an entity with the given UID has failed evaluation.
   * @param uid The unique identifier to check
   * @returns Whether the entity has failed
   * @public
   */
  hasFailed(uid) {
    return EntityRegistry.hasFailed(uid);
  }
  /**
   * Retrieves all targets defined in the policies.
   * @returns {Promise<string[]>} A promise resolved with an array of target UIDs.
   */
  listTargets() {
    return __async(this, null, function* () {
      try {
        const targets = yield this.explore({
          target: { all: true }
        });
        return targets.reduce((acc, target) => {
          if (target.uid !== void 0) {
            acc.push(target.uid);
          }
          return acc;
        }, []);
      } catch (error) {
        console.error('Error in "listTargets":', error);
        return [];
      }
    });
  }
  /**
   * Retrieves a list of performable actions on the specified target.
   * @param {string} target - A string representing the target.
   * @returns {Promise<string[]>} A promise resolved with an array of performable actions.
   */
  // Todo, include duties processes
  getPerformableActions(target, included = true) {
    return __async(this, null, function* () {
      try {
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
        return included ? Action.getIncluded(actions2) : actions2;
      } catch (error) {
        console.error('Error in "getPerformableActions":', error);
        return [];
      }
    });
  }
  /**
   * Retrieves the list of leftOperands associated with the specified target.
   * @param {string} target - A string representing the target.
   * @returns {Promise<string[]>} A promise resolved with an array of leftOperands.
   */
  listLeftOperandsFor(target) {
    return __async(this, null, function* () {
      try {
        const targets = yield this.explore({
          target
        });
        const leftOperands = /* @__PURE__ */ new Set();
        targets.forEach((target2) => {
          const parent = target2.getParent();
          const constraints = parent.getConstraints() || [];
          constraints.forEach((constraint) => {
            const leftOperand = constraint.leftOperand;
            if (leftOperand) {
              const value = leftOperand.getValue();
              leftOperands.add(value);
            }
          });
        });
        return Array.from(leftOperands);
      } catch (error) {
        console.error('Error in "listLeftOperandsFor":', error);
        return [];
      }
    });
  }
  /**
   * Verifies whether a specific action can be performed on a given target.
   * @param {ActionType} actionType - A string representing the type of action.
   * @param {string} target - A string representing the target.
   * @param {boolean} defaultResult - A boolean defining the value to return if no corresponding target is found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating the feasibility of the action.
   */
  isActionPerformable(actionType, target, defaultResult = false, resetFailures = true) {
    return __async(this, null, function* () {
      try {
        if (resetFailures) {
          EntityRegistry.resetFailures();
        }
        const targets = yield this.explore({
          target
        });
        const results = yield targets.reduce(
          (promise, target2) => __async(this, null, function* () {
            var _a;
            const acc = yield promise;
            const parent = target2.getParent();
            const action = parent.action;
            const namespaceDependency = (_a = action._namespace) == null ? void 0 : _a.length;
            return action && (yield action.includes(actionType)) || namespaceDependency ? acc.concat(yield parent.evaluate()) : acc;
          }),
          Promise.resolve([])
        );
        return results.length ? results.every((result) => result) : defaultResult;
      } catch (error) {
        console.error('Error in "isActionPerformable":', error);
        return false;
      }
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
      try {
        EntityRegistry.resetFailures();
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
            return target.uid ? this.isActionPerformable(actionType, target.uid, false, false) : false;
          })
        );
        const results = yield Promise.all(actionPromises);
        return results.length ? results.every((result) => result) : defaultResult;
      } catch (error) {
        console.error('Error in "evalResourcePerformabilities":', error);
        return false;
      }
    });
  }
  /**
   * Retrieves all duties defined in the policies.
   * @returns {Promise<RuleDuty[]>} Promise resolved with array of duties
   */
  getDuties() {
    return __async(this, null, function* () {
      try {
        return yield this.explore({
          pickAllDuties: true
        });
      } catch (error) {
        console.error('Error in "getDuties":', error);
        return [];
      }
    });
  }
  /**
   * Gets duties associated with a specific target.
   * @param {string} target - The target UID
   * @param {boolean} fulfilled - Whether to only return fulfilled duties (default: false)
   * @returns {Promise<RuleDuty[]>} Promise resolved with array of matching duties
   */
  getDutiesForTarget(target, fulfilled = false) {
    return __async(this, null, function* () {
      try {
        const targets = yield this.explore({ target });
        const duties = yield targets.reduce(
          (accPromise, target2) => accPromise.then((acc) => __async(this, null, function* () {
            const parent = target2.getParent();
            if (parent && parent instanceof RuleDuty) {
              const duty = parent;
              const isValidDuty = !fulfilled || (yield duty.evaluate());
              if (isValidDuty) {
                return [...acc, duty];
              }
            }
            return acc;
          })),
          Promise.resolve([])
        );
        return duties;
      } catch (error) {
        console.error('Error in "getDutiesForTarget":', error);
        return [];
      }
    });
  }
  /**
   * Gets duties for a specific action and target combination.
   * @param {string} action - The action name
   * @param {string} target - The target UID
   * @param {boolean} fulfilled - Whether to only return fulfilled duties (default: false)
   * @returns {Promise<RuleDuty[]>} Promise resolved with array of matching duties
   */
  getDutiesFor(action, target, fulfilled = false) {
    return __async(this, null, function* () {
      try {
        const duties = yield this.getDutiesForTarget(
          target,
          fulfilled
        );
        const filteredDuties = [];
        const dutyFilterPromises = duties.map((duty) => __async(this, null, function* () {
          const dutyAction = duty.action;
          if (dutyAction.value === action) {
            const isValidDuty = yield duty.evaluate();
            if (isValidDuty) {
              filteredDuties.push(duty);
            }
          }
        }));
        yield Promise.all(dutyFilterPromises);
        return filteredDuties;
      } catch (error) {
        console.error('Error in "getDutiesFor":', error);
        return [];
      }
    });
  }
  /**
   * Retrieves duties assigned to a specific assignee.
   * @param {string} assignee - The assignee UID
   * @returns {Promise<RuleDuty[]>} Promise resolved with array of assigned duties
   */
  getAssignedDuties(assignee) {
    return __async(this, null, function* () {
      try {
        const payload = _PolicyEvaluator.getAssigneePayload(assignee);
        return yield this.explore({
          assignee: payload
        });
      } catch (error) {
        console.error('Error in "getAssignedDuties":', error);
        return [];
      }
    });
  }
  /**
   * Retrieves duties emitted by a specific assigner.
   * @param {string} assigner - The assigner UID
   * @returns {Promise<RuleDuty[]>} Promise resolved with array of emitted duties
   */
  getEmittedDuties(assigner) {
    return __async(this, null, function* () {
      try {
        const payload = _PolicyEvaluator.getAssigneePayload(assigner);
        return yield this.explore({
          assigner: payload
        });
      } catch (error) {
        console.error('Error in "getEmittedDuties":', error);
        return [];
      }
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
      try {
        this.setFetcherOptions({ assignee });
        const payload = _PolicyEvaluator.getAssigneePayload(assignee);
        const entities = yield this.explore({
          assignee: payload
          // agreementAssignee: payload,
          // permissionAssignee: payload,
          // prohibitionAssignee: payload,
        });
        return this.evalDuties(entities, defaultResult);
      } catch (error) {
        console.error('Error in "fulfillDuties":', error);
        return false;
      }
    });
  }
  /**
   * Evaluates whether the agreement is fulfilled by the assignee.
   * @param {boolean} [defaultResult=false] - The default result if no duties are found.
   * @returns {Promise<boolean>} Resolves with a boolean indicating whether the agreement is fulfilled.
   */
  evalAgreementForAssignee(assignee, defaultResult = false) {
    return __async(this, null, function* () {
      try {
        this.setFetcherOptions({ assignee });
        const entities = yield this.explore({
          pickDuties: {
            parentEntityClass: [Policy]
          }
        });
        entities.filter((entity) => {
          const party = entity.assignee;
          return !(party == null ? void 0 : party.uid);
        });
        return this.evalDuties(entities, defaultResult);
      } catch (error) {
        console.error('Error in "evalAgreementForAssignee":', error);
        return false;
      }
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
      try {
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
      } catch (error) {
        console.error('Error in "evalDuties":', error);
        return false;
      }
    });
  }
  // Todo: Retrieve the expected value for a specific duty action
};
var PolicyEvaluator_default = PolicyEvaluator.getInstance();

// src/PolicyStateFetcher.ts
var PolicyStateFetcher = class _PolicyStateFetcher extends PolicyFetcher {
  constructor() {
    super();
    const _context = {};
    const properties = Object.getOwnPropertyNames(_PolicyStateFetcher.prototype);
    properties.forEach((property) => {
      const value = this[property];
      if (property.startsWith("get") && typeof value === "function") {
        const key = property.charAt(3).toLowerCase() + property.slice(4);
        _context[key] = value.bind(this);
      }
    });
    this._context = __spreadValues(__spreadValues({}, _context), this.context);
  }
  /**
   * Gets the context containing state functions
   * @returns {StateFunctions} The state functions context
   */
  get context() {
    return this._context;
  }
  /**
   * Gets the compensation state
   * @returns {Promise<boolean>} The compensation state
   * @protected
   */
  getCompensate() {
    return __async(this, null, function* () {
      return false;
    });
  }
};

// src/index.ts
var evaluator = PolicyEvaluator_default;
var instanciator = PolicyInstanciator_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Custom,
  PolicyDataFetcher,
  PolicyEvaluator,
  PolicyInstanciator,
  PolicyStateFetcher,
  evaluator,
  instanciator
});
//# sourceMappingURL=index.js.map