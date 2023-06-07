import { Collection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAll, DbServiceResponse } from "../services/dbServices";

export const getAllDevices = async (
  req: NextApiRequest,
  res: NextApiResponse,
  deviceCollection: Collection
) => {
  const devices: DbServiceResponse = await getAll(deviceCollection);

  if (devices.err) {
    return res.status(500).json({
      err: devices.err,
      msg: "Error al obtener la lista de dispositivos.",
    });
  }

  res.status(200).json({
    ...devices,
    msg: "Lista de dispositivos obtenida exitosamente.",
  });
};

export default {
  getAllDevices,
};

export interface Dispositivo {
  _id: string;
  nombre: string;
  stock?: number;
  prestado?: number;
  localPrestado: number;
}
