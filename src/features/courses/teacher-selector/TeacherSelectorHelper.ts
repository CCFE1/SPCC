import { setControl } from "@devices/deviceSlice";
import { getDayName, resetFormInputs } from "@utils/index";
import type { Horario } from "@models/interfaces";

import type { NrcTag, TeacherTag, LoanInputName, Semana } from "@models/types";

// Limpia los campos nrc, maestro, materia y aula
export const clearAction = (setValue: any) => {
  const toDelete: LoanInputName[] = ["maestros"];
  return resetFormInputs(setValue, toDelete);
};

// Obtener las materias de lo maestros.
export const getTeacherNrcs = (
  nrcs: NrcTag[],
  maestro: TeacherTag,
): NrcTag[] => {
  return nrcs.filter(
    (nrc: NrcTag) => !!nrc.maestro && nrc.maestro._id === maestro._id,
  );
};

// Ordenar horarios
export const getOrderedSchedules = (
  horariosDesordenados: NrcTag[],
): NrcTag[] => {
  return horariosDesordenados.sort(
    (a: any, b: any) => a.horarios[0].horaInicio - b.horarios[0].horaInicio,
  );
};

export const getTeachersWithTodayCourses = (
  teacherCourses: NrcTag[],
  dayname: Semana,
): NrcTag[] => {
  const coursesWithTodaySchedule = teacherCourses
    .map((course: NrcTag) => {
      const horarios: any = course.horarios.filter((horario: Horario) => {
        if (horario.dia === dayname) {
          return true;
        }

        return false;
      });

      return !!horarios.length
        ? {
            ...course,
            horarios,
          }
        : undefined;
    })
    .filter((item: any) => item !== undefined);

  // asegurarse de que el valor de retorno no contenga valores undefined
  return coursesWithTodaySchedule as NrcTag[];
};

export const setLoanData = (
  setValue: any,
  nearest: NrcTag,
  dispatch: any,
): void => {
  // Setteando nrc
  setValue("nrcs", nearest);

  // Setteando materia
  setValue("materias", {
    ...nearest.materia,
    label: nearest.materia.nombre,
    value: nearest.materia._id,
  });

  // Setteando aulas
  setValue("aulas", {
    label: nearest.horarios[0].aula,
    value: nearest.horarios[0].aula,
  });

  // Setteando hora de inicio
  setValue("horaInicio", {
    label: `${nearest.horarios[0].horaInicio}:00`,
    value: nearest.horarios[0].horaInicio,
  });

  // Setteando hora de fin
  setValue("horaFin", {
    label: `${nearest.horarios[0].horaFin}:00`,
    value: nearest.horarios[0].horaFin,
  });

  dispatch(setControl(nearest.horarios[0].aula));
};
