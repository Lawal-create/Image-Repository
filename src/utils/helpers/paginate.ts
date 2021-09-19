import { isValidDate } from "./isValidDate";
/**
 *  #### Utility Function to paginate any array of data directly from mongoDB query
 *
 * @param {} Model mongoose model defination (e.g User)
 * @param {Number} page specific page for the pagination
 * @param {Number} limit specific limit for the pagination
 * @param {Object} docQuery mongoose document query
 *
 * @return {Object} pagination result and data
 */

import { Model } from "mongoose";
import { populate } from "../../types/global";

export interface PaginatedResponse<DataType> {
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalRecords: number;
  totalPages: number;
  results: DataType[];
}
export const fetchMongoDBPaginatedData = async <ModelType>(
  Model: Model<ModelType>,
  page: number,
  limit: number,
  docQuery = {},
  populate?: populate,
  sortQuery?: { createdAt: number | -1 }
): Promise<PaginatedResponse<ModelType>> => {
  // Compute the start and end to monitor next and previous page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // Total number of documents in the mongo collection
  const count = await Model.find(docQuery)
    .sort(sortQuery)
    .countDocuments()
    .exec();

  const response = {} as PaginatedResponse<ModelType>;
  response.currentPage = page;
  // Next page is null if the endIndex is greater than the total number of records
  response.nextPage = endIndex < count ? page + 1 : null;
  //Previous Page
  response.prevPage = startIndex > 0 ? page - 1 : null;
  response.totalRecords = count;
  response.totalPages = Math.ceil(count / limit);
  // Using mongo limit and skip for pagination
  response.results = await Model.find(docQuery)
    .sort(sortQuery)
    .limit(limit)
    .skip(startIndex)
    .populate(populate);

  return response;
};

/**
 * Utility Function to paginate any array of data not from mongodb
 * @param {} data mongoose model defination (e.g User)
 * @param {Number} pageNumber specific page for the pagination
 * @param {Number} itemsPerPage specific limit for the pagination
 *
 * @return {Object} pagination result and data
 */
export const paginate = <DataType>(
  data: DataType[],
  pageNumber: number,
  itemsPerPage: number
): PaginatedResponse<DataType> => {
  // Compute the start and end to monitor next and previous page
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = pageNumber * itemsPerPage;
  // Total number of records
  const count = data.length;

  const response = {
    currentPage: pageNumber,
    // Next page is null if the endIndex is greater than the total number of records
    nextPage: endIndex < count ? pageNumber + 1 : null,
    // Previous page
    prevPage: startIndex > 0 ? pageNumber - 1 : null,
    totalRecords: count,
    totalPages: Math.ceil(count / itemsPerPage),
    // Slicing the data array
    results: data.slice(startIndex, endIndex)
  };
  return response;
};

export const populateFilter = (
  date: string,
  startDate: string,
  endDate: string,
  options: Record<string, unknown>
): Record<string, unknown> => {
  if (date) {
    if (isValidDate(date)) {
      const dateEntry = new Date(date);
      const min = dateEntry.toISOString();
      dateEntry.setDate(dateEntry.getDate() + 1);

      const max = dateEntry.toISOString();
      options.createdAt = { $gt: min, $lt: max };
    }
  } else if (startDate) {
    if (isValidDate(startDate)) {
      const dateEntry = new Date(startDate);
      const min = dateEntry.toISOString();

      if (endDate && isValidDate(endDate)) {
        const max = new Date(endDate).toISOString();
        options.createdAt = { $gt: min, $lt: max };
      } else {
        options.createdAt = { $gt: min };
      }
    }
  } else if (endDate) {
    if (isValidDate(endDate)) {
      const dateEntry = new Date(endDate);
      const max = dateEntry.toISOString();
      options.createdAt = { $lt: max };
    }
  }
  return options;
};
