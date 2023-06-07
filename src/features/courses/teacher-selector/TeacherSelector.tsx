import { useEffect, useMemo } from "react";
import { FormListGroup } from "@ui/index";
import { ActionMeta } from "react-select";
import { openDialog } from "@utils/index";
import { setControl } from "@devices/deviceSlice";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import {
  thereAreConsecutives,
  getNearestCourse,
} from "@courses/course-selector/CourseSelectorHelper";

import type { NrcTag, TeacherTag, Semana } from "@models/types";
import type { SelectorProps, Horario } from "@models/interfaces";

import {
  getDecimalHour,
  getDayName,
  getDecimalMinutes,
  getMDYDateString,
} from "@utils/index";

import {
  setLoanData,
  clearAction,
  getTeacherNrcs,
  getTeachersWithTodayCourses,
  getOrderedSchedules,
} from "./TeacherSelectorHelper";

import {
  fetchTeachers,
  selectTeachers,
  selectNrcs,
  selectDate,
} from "../courseSlice";

export default function TeacherSelector(props: SelectorProps) {
  const dispatch = useAppDispatch();
  const nrcs = useAppSelector(selectNrcs);
  const date = useAppSelector(selectDate);
  const teachers = useAppSelector(selectTeachers);

  // En caso de haber un valor inicial, se crea una función
  // estática para enviar el valor en su respectivo objeto.
  const { initialValue } = props;
  const defaultValue: any = useMemo(() => {
    return !initialValue
      ? undefined
      : {
          label: initialValue.maestro.nombre,
          value: initialValue.materia._id,
        };
  }, [initialValue]);

  const { isLoading, disabled } = props;
  useEffect(() => {
    // Dejar que carguen los nrc primero
    if (!isLoading && !disabled) {
      dispatch(fetchTeachers());
    }
  }, [dispatch, nrcs, isLoading]);

  const loadLoanData = (setValue: any, maestro: TeacherTag) => {
    setValue("maestros", maestro);

    const decimalHour: number = getDecimalHour();
    // Obtener las materias de lo maestros.
    const teacherCourses: NrcTag[] = getTeacherNrcs(nrcs, maestro);
    if (!teacherCourses.length) return;

    const dayname: Semana = getDayName(date);
    // Obtener los maestros y sus horarios de hoy si es que tienen
    const horariosDesordenados: NrcTag[] = getTeachersWithTodayCourses(
      teacherCourses,
      dayname
    );
    if (!horariosDesordenados || !horariosDesordenados.length) return;

    // Ordenar los horarios de mas temprano a mas tarde
    const horariosActuales: NrcTag[] =
      getOrderedSchedules(horariosDesordenados);

    // Saber si hay horarios consecutivos
    let areConsecutive: boolean = thereAreConsecutives(horariosActuales);

    // Conseguir el horario mas cercano a la hora mas cercana
    const nearest: NrcTag | undefined = getNearestCourse(
      horariosActuales,
      areConsecutive
    );
    if (!nearest) return;

    return setLoanData(setValue, nearest, dispatch);
  };

  const onChange = (selectedItem: TeacherTag, { action }: ActionMeta<any>) => {
    const { setValue } = props;
    const options: any = {
      "clear": () => clearAction(setValue),
      "create-option": () => setValue("maestros", selectedItem),
      "select-option": () => {
        loadLoanData(setValue, selectedItem);
      },
    };

    try {
      options[action]();
    } catch (e: any) {
      openDialog(
        "Lo sentimos",
        "Esta acción no está permitida por el momento."
      );
    }
  };

  return (
    <FormListGroup
      label={{
        text: "Maestro",
        styles: {
          marginBottom: ".5rem",
        },
      }}
      listInput={{
        isLoading: isLoading,
        name: "maestros",
        placeholder: "Maestro",
        size: 70,
        optionList: teachers,
        styles: {
          marginLeft: ".5rem",
        },
        select: true,
        onChange,
        initialValue: defaultValue,
        disabled,
      }}
    />
  );
}
