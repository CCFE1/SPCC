import { ObjectId, Collection } from "mongodb";

const saveOne = async (
  collection: Collection,
  data: any
): Promise<DbServiceResponse> => {
  try {
    await collection.insertOne({ ...data });
    return {
      err: false,
    };
  } catch (e) {
    console.log(e);
    return {
      err: true,
    };
  }
};

const saveMany = async (
  collection: Collection,
  data: any
): Promise<DbServiceResponse> => {
  try {
    await collection.insertMany(data);
    return {
      err: false,
    };
  } catch (e) {
    console.log(e);
    return {
      err: true,
    };
  }
};

const getOne = async (
  collection: Collection,
  option: any,
  projection: any = {}
): Promise<DbServiceResponse> => {
  try {
    const query =
      typeof option === "string"
        ? {
            _id: new ObjectId(option),
          }
        : option;

    const data: any = await collection.findOne(query, projection);
    return {
      err: false,
      data,
    };
  } catch (e) {
    console.log(e);
    return {
      err: true,
    };
  }
};

const getAll = async (
  collection: Collection,
  query?: any
): Promise<DbServiceResponse> => {
  try {
    const condition = !!query ? query : {};
    const data: any = await collection.find(condition).toArray();
    return {
      err: false,
      data,
    };
  } catch (e) {
    console.log(e);
    return {
      err: true,
    };
  }
};

const updateOne = async (
  collection: Collection,
  query: any,
  modifier: any
): Promise<DbServiceResponse> => {
  try {
    const filter =
      typeof query === "string"
        ? {
            _id: new ObjectId(query),
          }
        : query;

    await collection.updateOne(filter, modifier);
    return {
      err: false,
    };
  } catch (e) {
    console.log(e);
    return {
      err: true,
    };
  }
};

const deleteAll = async (
  collection: Collection
): Promise<DbServiceResponse> => {
  try {
    await collection.deleteMany({});
    return {
      err: false,
    };
  } catch (e) {
    console.log(e);
    return {
      err: true,
    };
  }
};

export { saveOne, saveMany, getOne, getAll, updateOne, deleteAll };

export interface DbServiceResponse {
  err: boolean;
  data?: any;
}
