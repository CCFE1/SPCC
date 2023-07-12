import { setControl } from "@devices/deviceSlice";
import { isNear } from "./CourseSelectorUtils";

import type { Horario } from "@models/interfaces";
import type { NrcTag, LoanInputName } from "@models/types";

import { getDayName, resetFormInputs } from "@utils/index";

// Limpia los campos nrc, maestro, materia y aula
export const clearAction = (setValue: any): void => {
  const toDelete: LoanInputName[] = ["nrcs", "maestros", "materias", "aulas"];
  return resetFormInputs(setValue, toDelete);
};

// Obtener los cursos de hoy
export const getTodayCourses = (
  nrcs: NrcTag[],
  selectedItem: any,
): NrcTag[] => {
  return nrcs.filter((nrc: NrcTag) => nrc.materia._id === selectedItem._id);
};

// Obtener los horarios de los cursos de hoy
export const getTodayCoursesSchedule = (
  todayCourses: NrcTag[],
): (NrcTag | undefined)[] => {
  const dayName = getDayName();
  return todayCourses
    .map((course: NrcTag) => {
      const horarios: any = course.horarios.filter((horario: Horario) => {
        let isToday = false;
        if (horario.dia === dayName) {
          isToday = true;
        }

        return isToday;
      });

      return !!horarios.length
        ? {
            ...course,
            horarios,
          }
        : undefined;
    })
    .filter((item: any) => item !== undefined);
};

// Ordenar los horarios de los cursos de hoy
export const getOrderedSchedules = (
  schedules: (NrcTag | undefined)[],
): (NrcTag | undefined)[] => {
  return !schedules
    ? []
    : schedules.sort((a: any, b: any) => {
        return a.horarios[0].horaInicio - b.horarios[0].horaInicio;
      });
};

// Obtiene true si hay horarios que sean consecutivos.
export const thereAreConsecutives = (horariosActuales: NrcTag[]): boolean => {
  let areConsecutive = false;
  if (horariosActuales.length > 1) {
    // Detectar horarios consecutivos
    for (let i = 1; i < horariosActuales.length; i++) {
      if (
        horariosActuales[i - 1].horarios[0].horaFin ===
        horariosActuales[i].horarios[0].horaInicio
      ) {
        areConsecutive = true;
      }
    }
  }

  return areConsecutive;
};

// Obtiene el curso mas cercano
export const getNearestCourse = (
  horariosActuales: (NrcTag | undefined)[],
  areConsecutive: boolean,
): NrcTag | undefined => {
  // Obtener cercano
  const nearest: any = horariosActuales.filter((course: any) => {
    return isNear(course, areConsecutive);
  });

  return nearest[nearest.length - 1];
};

export const setLoanData = (
  setValue: any,
  nearestCourse: NrcTag,
  dispatch: any,
): void => {
  // Setteando nrc
  setValue("nrcs", nearestCourse);

  // Setteando maestro
  setValue(
    "maestros",
    nearestCourse.maestro
      ? {
          ...nearestCourse.maestro,
          label: nearestCourse.maestro.nombre,
          value: nearestCourse.maestro._id,
        }
      : "",
  );

  // Setteando aulas
  setValue("aulas", {
    label: nearestCourse.horarios[0].aula,
    value: nearestCourse.horarios[0].aula,
  });

  // Setteando hora de inicio
  setValue("horaInicio", {
    label: `${nearestCourse.horarios[0].horaInicio}:00`,
    value: nearestCourse.horarios[0].horaInicio,
  });

  // Setteando hora de fin
  setValue("horaFin", {
    label: `${nearestCourse.horarios[0].horaFin}:00`,
    value: nearestCourse.horarios[0].horaFin,
  });

  dispatch(setControl(nearestCourse.horarios[0].aula));
};
