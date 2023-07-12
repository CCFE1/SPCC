import { Collection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAll, DbServiceResponse } from "../services/dbServices";

export const getTeachers = async (
  req: NextApiRequest,
  res: NextApiResponse,
  teachersCollection: Collection,
) => {
  // Obtener todos los maestros.
  const allTeachers: DbServiceResponse = await getAll(teachersCollection);
  if (allTeachers.err) {
    return res.status(500).json({
      err: true,
      msg: "Error al obtener la lista de maestros.",
    });
  }

  // Obtener maestros con préstamos activos.
  const actives: DbServiceResponse = await getActiveTeachers(
    teachersCollection,
  );
  if (actives.err) {
    return res.status(500).json({
      err: actives.err,
      msg: "Error al obtener la lista de maestros.",
    });
  }

  // Obtener los maestros que no tienen préstamos activos
  const data: any = allTeachers.data.filter((teacher: any) => {
    for (let activeTeacher of actives.data) {
      if (activeTeacher.nombre === teacher.nombre) {
        return false;
      }
    }

    return true;
  });

  res.status(200).json({
    data,
    err: false,
    msg: "Lista de maestros obtenida exitosamente.",
  });
};

/////////////////////////////
// Local Utils
/////////////////////////////
// Obtener las maestros que tienen préstamos actvos
async function getActiveTeachers(
  teachersCollection: Collection,
): Promise<DbServiceResponse> {
  try {
    const data = (await teachersCollection
      .aggregate([
        {
          $lookup: {
            from: "prestamos",
            localField: "nombre",
            foreignField: "maestro.nombre",
            as: "prestamo",
          },
        },
        {
          $unwind: "$prestamo",
        },
        {
          $match: {
            "prestamo.status": {
              $eq: "activo",
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            nombre: {
              $first: "$nombre",
            },
            status: {
              $first: "$prestamo.status",
            },
          },
        },
      ])
      .toArray()) as any;
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
}

export default {
  getTeachers,
};
