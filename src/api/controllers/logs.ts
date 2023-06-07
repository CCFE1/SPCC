import { Collection } from "mongodb";
import type { Log } from "@models/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { saveMany, DbServiceResponse } from "../services/dbServices";

export const saveLogs = async (
  req: NextApiRequest,
  res: NextApiResponse,
  logsCollection: Collection
) => {
  const logs: Log[] = req.body.map((log: any) => {
    const {id, ...restOfLog} = log;
    return restOfLog;
  });

  if (!logs || logs.length === 0) {
    return res.status(401).json({
      err: true,
      msg: "Lista de logs vacia"
    });
  }

  const { err }: DbServiceResponse = await saveMany(logsCollection, logs)
  if (err) {
    return res.status(501).json({
      err: true,
      msg: "Error en el servidor al guardar los logs"
    });
  }

  return res.json({
    err: false,
    msg: "Logs guardados correctamente",
  });
};
