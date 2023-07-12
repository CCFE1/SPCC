import { Collection } from "mongodb";
import type { Maestro } from "@models/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { removeDup, removeDupString, reemplazarAcentos } from "@utils/index";
import {
  getAll,
  saveMany,
  deleteAll,
  DbServiceResponse,
} from "../services/dbServices";

export const uploadSchedules = async (
  req: NextApiRequest,
  res: NextApiResponse,
  coursesCollection: Collection,
  teachersCollection: Collection,
  classroomsCollection: Collection,
) => {
  const { borrar, schedules } = req.body;

  // Obtener los maestros de los horarios enviados
  const newTeachers: string[] = removeDupString(
    schedules
      .map((schedule: any) => schedule.CATEDRATICO)
      .filter((t: any) => !!t),
  );

  // Normalizando los nombres de los maestros en los datos enviados
  const normalizedSchedules: any = schedules.map((schedule: any) => {
    const normalizedTeacher = newTeachers.find(
      (newT: any) =>
        !!schedule.CATEDRATICO &&
        reemplazarAcentos(newT) === reemplazarAcentos(schedule.CATEDRATICO),
    );

    if (!!normalizedTeacher) {
      return {
        ...schedule,
        CATEDRATICO: normalizedTeacher,
      };
    }

    return schedule;
  });

  // Obteniendo los maestros en la base de datos.
  const oldTeachers: DbServiceResponse = await getAll(teachersCollection);
  if (oldTeachers.err) {
    return res.status(501).json({
      msg: "Fallo al obtener los maestros",
    });
  }

  // Se obtienen los maestros faltantes de los nuevos horarios
  const missingTeachers: string[] = newTeachers.filter((newT: string) => {
    return !oldTeachers.data.some((oldT: Maestro) => oldT.nombre === newT);
  });
  // Añadir los maestros faltantes a la base de datos
  if (missingTeachers.length > 0) {
    const { err }: DbServiceResponse = await saveMany(
      teachersCollection,
      missingTeachers.map((teacher: string) => ({
        nombre: teacher,
      })),
    );
    if (err) {
      res.status(501).json({
        msg: "Fallo al guardar los maestros",
      });
    }
  }

  // Obtener aulas
  const classrooms: DbServiceResponse = await getAll(classroomsCollection);

  // Obtener las aulas de los nuevos horarios
  const newClassrooms = normalizedSchedules
    .map((schedule: any) => {
      const aulas = Object.entries(schedule)
        .map(([key, value]: any[]) => {
          const isAula = key.split("-")[1];
          if (isAula === "AULA") {
            return value.toString();
          }

          return;
        })
        .filter((x) => !!x);

      return aulas.flat();
    })
    .flat();

  // Buscar aulas que no se encuentren en la bd
  const missingClassrooms: string[] = removeDup(newClassrooms).reduce(
    (acc: string[], schedule: any) => {
      const existClassroom: string = classrooms.data.some(
        (oldC: any) => oldC.nombre === schedule,
      );

      if (!existClassroom) {
        return [...acc, schedule];
      }

      return acc;
    },
    [],
  );

  // Añadir las aulas faltantes a la base de datos
  if (missingClassrooms.length > 0) {
    const { err }: DbServiceResponse = await saveMany(
      classroomsCollection,
      missingClassrooms.map((classroom: string) => ({
        nombre: classroom,
      })),
    );
    if (err) {
      res.status(501).json({
        msg: "Fallo al guardar las aulas",
      });
    }
  }

  // Obtener los nombres de los cursos
  const courseNames: any = removeDup(
    normalizedSchedules.map((course: any) => {
      return course.EE;
    }),
  );

  const teachers: DbServiceResponse = await getAll(teachersCollection);
  if (teachers.err) {
    return res.status(501).json({
      msg: "Fallo al obtener los maestros",
    });
  }
  // Formatear cursos
  const coursesFormated = removeDup(courseNames).map((courseName) => {
    // Obtener todas las asignaciones del curso
    const allOfActualCourse = normalizedSchedules.filter(
      (course: any) => course.EE === courseName,
    );
    const asignaciones = allOfActualCourse.map((course: any) => {
      // Obtener los nombres de los dias que tiene esa asignacion
      const dayNames = Object.keys(course).filter(
        (attName: any) =>
          attName !== "EE" &&
          attName !== "NRC" &&
          attName !== "CATEDRATICO" &&
          !attName.includes("AULA"),
      );
      // Obtener los horarios de cada dia
      const horarios = dayNames.map((dayName) => {
        const hours = course[dayName].split("-");
        return {
          aula: course[`${dayName}-AULA`],
          dia: dayName.toLowerCase(),
          horaInicio: parseInt(hours[0], 10),
          horaFin: parseInt(hours[1], 10),
        };
      });

      const selectedTeacher = teachers.data.filter(
        (teacher: any) => teacher.nombre === course["CATEDRATICO"],
      );
      return {
        nrc: course["NRC"],
        maestro: !!selectedTeacher.length ? selectedTeacher[0] : null,
        horarios,
      };
    });

    return {
      nombre: courseName,
      asignaciones,
    };
  });

  // Eliminar todos los cursos en caso de haberse seleccionado esa opcion
  if (borrar) {
    const { err }: DbServiceResponse = await deleteAll(coursesCollection);
    if (err) {
      res.status(501).json({
        msg: "Fallo al eliminar los horarios anteriores",
      });
    }
  }

  // Guardar todos los nuevos horarios
  const { err } = await saveMany(coursesCollection, coursesFormated);
  if (err) {
    res.status(501).json({
      msg: "Fallo al guardar los nuevos horarios",
    });
  }

  return res.json({
    err: false,
    msg: "Logs guardados correctamente",
  });
};
