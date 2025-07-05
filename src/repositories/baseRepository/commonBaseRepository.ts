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

  updateById<K extends keyof TModels>(
    modelName: K,
    id: string,
    updateData: UpdateQuery<TModels[K]>
  ): Promise<TModels[K] | null> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);
    return model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  deleteById<K extends keyof TModels>(
    modelName: K,
    id: string
  ): Promise<TModels[K] | null> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findByIdAndDelete(id).exec();
  }

  findOneAndUpdate<K extends keyof TModels>(
    modelName: K,
    filter: FilterQuery<TModels[K]>,
    updateData: UpdateQuery<TModels[K]>
  ): Promise<TModels[K] | null> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findOneAndUpdate(
      filter,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  findByIdAndUpdate<K extends keyof TModels>(
    modelName: K,
    id: string,
    updateData: UpdateQuery<TModels[K]>,
    options?: { new?: boolean; runValidators?: boolean }
  ): Promise<TModels[K] | null> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findByIdAndUpdate(id, updateData, {
      new: options?.new ?? true,
      runValidators: options?.runValidators ?? true,
      ...options,
    });
  }

  findMany<K extends keyof TModels>(
    modelName: K,
    query: FilterQuery<TModels[K]>,
    options?: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> }
  ): Promise<TModels[K][]> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model
      .find(query)
      .skip(options?.skip ?? 0)
      .limit(options?.limit ?? 0)
      .sort(options?.sort ?? {});
  }

  findManyWithPopulate<K extends keyof TModels>(
    modelName: K,
    query: FilterQuery<TModels[K]>,
    populateOptions: {
      path: string;
      model: string;
      select?: string;
    }[]
  ): Promise<TModels[K][]> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.find(query).populate(populateOptions);
  }

  count<K extends keyof TModels>(
    modelName: K,
    query: FilterQuery<TModels[K]>
  ): Promise<number> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.countDocuments(query);
  }

  aggregate<K extends keyof TModels>(
    modelName: K,
    pipeline: any[]
  ): Promise<any[]> {
    const model = this._models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.aggregate(pipeline);
  }
}
