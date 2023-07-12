import { Collection, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAll, DbServiceResponse } from "../services/dbServices";

export const getClassrooms = async (
  req: NextApiRequest,
  res: NextApiResponse,
  classroomCollection: Collection,
) => {
  // Obtener todas las aulas.
  const allClassrooms: DbServiceResponse = await getAll(classroomCollection);
  if (allClassrooms.err) {
    return res.status(500).json({
      err: true,
      msg: "Error al obtener la lista de aulas.",
    });
  }

  // Obtener aulas con préstamos activos.
  const actives: DbServiceResponse = await getActiveClassrooms(
    classroomCollection,
  );
  if (actives.err) {
    return res.status(500).json({
      err: actives.err,
      msg: "Error al obtener la lista de aulas.",
    });
  }

  // Obtener las aulas que no tienen préstamos activos
  const data: Aula[] = allClassrooms.data.filter((classroom: Aula) => {
    for (let classroomActive of actives.data) {
      if (classroomActive.nombre === classroom.nombre) {
        return false;
      }
    }

    return true;
  });

  res.status(200).json({
    data,
    err: false,
    msg: "Lista de aulas obtenida exitosamente.",
  });
};

/////////////////////////////
// Local Utils
/////////////////////////////
// Obtener las aulas que tienen préstamos actvos
async function getActiveClassrooms(
  classroomCollection: Collection,
): Promise<DbServiceResponse> {
  try {
    const data = (await classroomCollection
      .aggregate([
        {
          $lookup: {
            from: "prestamos",
            localField: "nombre",
            foreignField: "materia.horario.aula",
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
      .toArray()) as Aula[];
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
  getClassrooms,
};

export interface Aula {
  _id: ObjectId;
  nombre: string;
  status?: "entrante" | "activo" | "deuda" | "inactivo";
}
