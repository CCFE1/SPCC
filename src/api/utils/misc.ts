import path from "path";
import { fileURLToPath } from "url";
import clientPromise from "./mongodb";
import { MongoClient, Collection, Db } from "mongodb";
import type { DBCollectionsResponse } from "@models/interfaces";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import type { Semana } from "@models/types";

////////////////////////////////////
// @ Time
////////////////////////////////////
// Obtener nombre del dia
export const getDayName = (): Semana => {
  const days: Semana[] = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  return days[new Date().getDay()];
};

////////////////////////////////////
// @ MongoConnection
////////////////////////////////////
export const getDBCollections = async (
  collectionNames: string[]
): Promise<DBCollectionsResponse> => {
  try {
    const conn: MongoClient = await clientPromise;
    const db: Db = conn.db("loop");

    const collections: Collection[] = collectionNames.map(
      (collectionName: string) => db.collection(collectionName)
    );

    return {
      error: false,
      collections,
    };
  } catch (e) {
    console.log(e);
    return {
      error: true,
    };
  }
};
