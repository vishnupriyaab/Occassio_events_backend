import { Document, FilterQuery, Model, Query, UpdateQuery } from "mongoose";

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
  createData<K extends keyof TModels>(
    modelName: K,
    data: Partial<TModels[K]>
  ): Promise<TModels[K]> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.create(data);
  }
  updateOne<K extends keyof TModels>(
    modelName: K,
    filter: FilterQuery<TModels[K]>,
    updateData: UpdateQuery<TModels[K]>,
    options?: { upsert?: boolean }
  ): Promise<import("mongodb").UpdateResult> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.updateOne(filter, { $set: updateData }, options);
  }
  findById<K extends keyof TModels>(
    modelName: K,
    id: string
  ): Query<TModels[K] | null, TModels[K]> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findById(id);
  }

  // findAll<K extends keyof TModels>(
  //   modelName: K,
  //   query: FilterQuery<TModels[K]>
  // ): Promise<TModels[K][]> {
  //   const model = this._models[modelName];
  //   if (!model) throw new Error(`Model ${String(modelName)} not found`);
  //   return model.find(query);
  // }
  updateById<K extends keyof TModels>(
    modelName: K,
    id: string,
    updateData: UpdateQuery<TModels[K]>
  ): Promise<TModels[K] | null> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }
  // deleteById<K extends keyof TModels>(
  //   modelName: K,
  //   id: string
  // ): Promise<TModels[K] | null> {
  //   const model = this._models[modelName];
  //   if (!model) throw new Error(`Model ${String(modelName)} not found`);

  //   return model.findByIdAndDelete(id).exec();
  // }
}
