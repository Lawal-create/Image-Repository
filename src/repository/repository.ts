import { Model, FilterQuery, UpdateQuery } from "mongoose";
import { PaginatedResponse } from "../utils/helpers/paginate";

export interface IRepository<T> {
  create(body: T): Promise<T | void>;
  createMany(body: T[]): Promise<T[] | void>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>, select: string | null): Promise<T | null>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  findByIdAndDelete(id: string): Promise<void>;
  findOneAndDelete(filter: FilterQuery<T>): Promise<void>;
  deleteMany(filter: FilterQuery<T>): Promise<void>;
  updateMany(filter: FilterQuery<T>, updates: UpdateQuery<T>): Promise<void>;
  findAndPaginate(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    sort: any,
    select?: string | null
  ): Promise<PaginatedResponse<T>>;
}

class Repository<DataType> implements IRepository<DataType> {
  model: Model<DataType>;

  constructor(model: Model<DataType>) {
    this.model = model;
  }

  create = async (body: DataType): Promise<DataType | void> => {
    const data = await this.model.create(body);
    return data;
  };

  createMany = async (body: DataType[]): Promise<DataType[] | void> => {
    const data = await this.model.create(body);
    return data;
  };

  findById = async (id: string): Promise<DataType | null> => {
    const data = await this.model.findById(id);
    return data;
  };
  find = async (filter: FilterQuery<DataType> = {}): Promise<DataType[]> => {
    const data = await this.model.find(filter);
    return data;
  };

  findOne = async (
    filter: FilterQuery<DataType> = {},
    selected: string | null = null
  ): Promise<DataType | null> => {
    let query = this.model.findOne(filter);
    if (selected) query = query.select(selected);
    const data = await query;
    return data;
  };

  findByIdAndDelete = async (id: string): Promise<void> => {
    await this.model.findByIdAndDelete(id);
  };

  findOneAndDelete = async (filter: FilterQuery<DataType>): Promise<void> => {
    await this.model.findOneAndDelete(filter);
  };

  deleteMany = async (filter: FilterQuery<DataType>): Promise<void> => {
    await this.model.deleteMany(filter);
  };

  updateMany = async (
    query: FilterQuery<DataType>,
    updates: UpdateQuery<DataType>
  ): Promise<void> => {
    await this.model.updateMany(query, updates);
  };

  findAndPaginate = async (
    filter: FilterQuery<DataType>,
    page: number,
    limit: number,
    sort: any, //-1 for descending order of course code, 1 for ascending,
    select: string | null = null
  ): Promise<PaginatedResponse<DataType>> => {
    const totalRecords = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);
    const currentPage = page;
    const nextPage = page + 1 <= totalPages ? page + 1 : null;
    const prevPage = page - 1 >= 0 ? page - 1 : null;

    let query = this.model
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    if (select) query = query.select(select);

    const results = await query;
    return {
      currentPage,
      nextPage,
      prevPage,
      totalRecords,
      totalPages,
      results
    };
  };
}

export default Repository;
