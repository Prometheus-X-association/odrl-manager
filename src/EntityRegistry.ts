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
  private static parentRelations: ParentRelations = {};
  private static entityReferences: EntityReferences = {};

  public static getDataFetcherFromPolicy(
    rootUID: string,
  ): PolicyDataFetcher | undefined {
    const root: ModelBasic = EntityRegistry.entityReferences[rootUID];
    return root?._fetcherUID
      ? EntityRegistry.entityReferences[root._fetcherUID]
      : undefined;
  }

  public static getStateFetcherFromPolicy(
    rootUID: string,
  ): PolicyStateFetcher | undefined {
    const root: ModelBasic = EntityRegistry.entityReferences[rootUID];
    return root?._stateFetcherUID
      ? EntityRegistry.entityReferences[root._stateFetcherUID]
      : undefined;
  }

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
}
