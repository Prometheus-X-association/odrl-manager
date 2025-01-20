import { PolicyDataFetcher } from 'PolicyDataFetcher';
import { PolicyStateFetcher } from 'PolicyStateFetcher';
import { ModelBasic } from 'models/ModelBasic';

interface EntityReferences {
  [key: string]: any;
}
interface ParentRelations {
  [key: string]: string;
}

export class EntityRegistry {
  /**
   * Map of parent-child relationships between entities
   * @private
   */
  private static parentRelations: ParentRelations = {};

  /**
   * Map of all entity references by their UIDs
   * @private
   */
  private static entityReferences: EntityReferences = {};

  /**
   * Array of entities that have failed evaluation
   * @private
   */
  private static failures: ModelBasic[];

  /**
   * Gets the data fetcher associated with a policy
   * @param {string} rootUID - The UID of the root policy
   * @returns {PolicyDataFetcher | undefined} The associated data fetcher or undefined
   */
  public static getDataFetcherFromPolicy(
    rootUID: string,
  ): PolicyDataFetcher | undefined {
    const root: ModelBasic = EntityRegistry.entityReferences[rootUID];
    return root?._fetcherUID
      ? EntityRegistry.entityReferences[root._fetcherUID]
      : undefined;
  }

  /**
   * Gets the state fetcher associated with a policy
   * @param {string} rootUID - The UID of the root policy
   * @returns {PolicyStateFetcher | undefined} The associated state fetcher or undefined
   */
  public static getStateFetcherFromPolicy(
    rootUID: string,
  ): PolicyStateFetcher | undefined {
    const root: ModelBasic = EntityRegistry.entityReferences[rootUID];
    return root?._stateFetcherUID
      ? EntityRegistry.entityReferences[root._stateFetcherUID]
      : undefined;
  }

  /**
   * Gets an entity by its UID
   * @param {string} uid - The UID of the entity to retrieve
   * @returns {any | undefined} The entity or undefined if not found
   */
  public static getEntity(uid: string): any | undefined {
    return EntityRegistry.entityReferences[uid];
  }

  public static addReference(model: any): void {
    EntityRegistry.entityReferences[model._objectUID] = model;
  }

  public static cleanReferences(): void {
    EntityRegistry.parentRelations = {};
    EntityRegistry.entityReferences = {};
  }

  public static setParent(child: ModelBasic, parent: ModelBasic): void {
    EntityRegistry.parentRelations[child._objectUID] = parent._objectUID;
  }

  public static getParent(child: ModelBasic): ModelBasic {
    const uid = EntityRegistry.parentRelations[child._objectUID];
    return EntityRegistry.entityReferences[uid];
  }

  public static addFailure(model: ModelBasic): void {
    EntityRegistry.failures.push(model);
  }

  public static hasFailed(uid: string): boolean {
    return EntityRegistry.failures.some((failure) => {
      const failureWithUid = failure as { uid?: string };
      return failureWithUid.uid === uid;
    });
  }

  public static resetFailures(): void {
    EntityRegistry.failures = [];
  }
}
