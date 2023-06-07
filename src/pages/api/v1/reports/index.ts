import type { NextApiRequest, NextApiResponse } from "next";
import { generateReports, defaultResponse } from "@api/controllers";
import { DBCollectionsResponse } from "@models/interfaces";
import { getDBCollections } from "@api/utils";
import { Collection } from "mongodb";

const reportsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Obtener las colecciones de los documentos.
  const { error, collections }: DBCollectionsResponse = await getDBCollections([
    "dispositivos",
    "prestamos",
    "logs"
  ]);
  
  if (error || !collections) {
    return res.status(500).json({
      msg: "Error al conectar con la base de datos",
    });
  }

  // Métodos de solicitud aceptados por esta ruta.
  const options: any = {
    POST: generateReports,
    default: defaultResponse,
  };

  const [devices, loans, logs]: Collection[] = collections;
  const method: string = req.method as string;

  const action: any = options[method] ?? options["default"];
  
  return await action(req, res, devices, loans, logs);
};

export default reportsHandler;
