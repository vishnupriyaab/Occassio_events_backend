import { FilterQuery, Model, Query, UpdateQuery } from "mongoose";

export default class CommonBaseRepository<
  TModels extends Record<string, Document>
> {
  protected _models: { [K in keyof TModels]: Model<TModels[K]> };

  constructor(models: { [K in keyof TModels]: Model<TModels[K]> }) {
    this._models = models;
  }

  findOne<K extends keyof TModels>(
    modelName: K,
    query: FilterQuery<TModels[K]>
  ): Query<TModels[K] | null, TModels[K]> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findOne(query);
  }
}
