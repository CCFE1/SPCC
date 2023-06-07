import { Dayjs } from "dayjs";
import { Prestamo } from "./loan";
import { CourseTag, NrcTag, TeacherTag } from "@models/types";

export interface SelectorProps {
  initialValue?: Prestamo;
  isLoading?: boolean;
  disabled?: boolean;
  setValue: any;
}

export interface Tag {
  id?: number | string;
  label: string;
  value: number | string;
}

export interface NrcMeta {
  materia: {
    readonly _id: string;
    readonly nombre: string;
  };
}

export interface CourseState {
  loanDate: string;
  classrooms: Tag[];
  courses: CourseTag[];
  nrcs: NrcTag[];
  teachers: TeacherTag[];
}
