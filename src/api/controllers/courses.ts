import { Collection } from "mongodb";
import { getAll, DbServiceResponse } from "../services/dbServices";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Materia, Asignacion, Horario } from "@models/interfaces";
import type { Semana } from "@models/types";

export const getCourses = async (
  req: NextApiRequest,
  res: NextApiResponse,
  coursesCollection: Collection
) => {
  const { dayname }: Partial<{ [key: string]: string | string[] }> =
    req.query;
  if (!dayname) {
    return res.status(500).json({
      err: true,
      msg: "Error al obtener la lista de materias.",
    });
  }

  const decodedDayname: Semana = decodeURIComponent(dayname?.toString()) as Semana;
  // Obtener todas las materias.
  const allCourses: DbServiceResponse = await getAll(coursesCollection);
  if (allCourses.err) {
    return res.status(500).json({
      err: true,
      msg: "Error al obtener la lista de materias.",
    });
  }

  // Obtener materias con préstamos activos.
  const actives: DbServiceResponse = await getActiveCourses(coursesCollection);
  if (actives.err) {
    return res.status(500).json({
      err: actives.err,
      msg: "Error al obtener la lista de materias.",
    });
  }

  // Eliminar de las asignaciones los nrcs y maestros activos
  const inactiveData: Materia[] = allCourses.data.map((materia: Materia) => {
    const asignaciones = materia.asignaciones.filter(
      (asignacion: Asignacion) => {
        for (let activeCourse of actives.data) {
          const areEqual = isCourseIn(activeCourse, asignacion);
          if (areEqual) {
            return false;
          }
        }

        return true;
      }
    );

    return {
      ...materia,
      asignaciones,
    };
  });

  // Obtener materias que tengan horario de hoy y eliminar todas las que no.
  const todayData: (Materia | undefined)[] = inactiveData
    .map((materia: Materia) => {
      // Filtrar asignaciones,
      const asignaciones: any = materia.asignaciones
        .map((asignacion: Asignacion) => {
          // Filtrar si el horario es del dia de hoy
          const horarios: Horario[] = asignacion.horarios.filter(
            (horario: Horario) => {
              if (horario.dia === decodedDayname) {
                return true;
              }

              return false;
            }
          );

          return !horarios.length
            ? undefined
            : {
                ...asignacion,
                horarios,
              };
        })
        .filter((item: any) => item !== undefined);

      return !asignaciones.length
        ? undefined
        : {
            ...materia,
            asignaciones,
          };
    })
    .filter((item: any) => item !== undefined);

  res.status(200).json({
    data: todayData,
    err: false,
    msg: "Lista de materias obtenida exitosamente.",
  });
};

/////////////////////////////
// Local Utils
/////////////////////////////
// Saber si el curso activo está en todos los cursos
function isCourseIn(activeCourse: any, asignacion: Asignacion) {
  if (activeCourse.nrc === asignacion.nrc) {
    return true;
  }

  if (
    !!asignacion.maestro &&
    activeCourse.maestro === asignacion.maestro.nombre
  ) {
    return true;
  }

  return false;
}

// Obtener las materias que tienen préstamos actvos
async function getActiveCourses(
  coursesCollection: Collection
): Promise<DbServiceResponse> {
  try {
    const data = (await coursesCollection
      .aggregate([
        {
          $lookup: {
            from: "prestamos",
            localField: "nombre",
            foreignField: "materia.nombre",
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
          $project: {
            materia: "$nombre",
            status: "$prestamo.status",
            nrc: "$prestamo.materia.nrc",
            maestro: "$prestamo.maestro.nombre",
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
  getCourses,
};
