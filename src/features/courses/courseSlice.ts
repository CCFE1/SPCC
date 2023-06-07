import { RootState } from "@store/store";
import axios from "axios";

import {
  getDateISOFormat,
  getDateFromISOFormat,
  getFetchConfig,
} from "@utils/index";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { CourseTag, NrcTag, TeacherTag, Semana } from "@models/types";

import type {
  Maestro,
  Materia,
  Asignacion,
  CourseState,
} from "@models/interfaces";

///////////////////////////
// State
///////////////////////////
const initialState: CourseState = {
  loanDate: getDateISOFormat(),
  classrooms: [],
  courses: [],
  nrcs: [],
  teachers: [],
};

///////////////////////////
// Async functions
///////////////////////////

// Function to get all classrooms
export const fetchClassrooms = createAsyncThunk(
  "courses/fetchClassrooms",
  async () => {
    const config = getFetchConfig();
    const response: any = await axios.get<any>(
      `/api/v1/classrooms`,
      config
    );
    return response.data.data.map((aula: any) => ({
      label: aula.nombre,
      value: aula.nombre,
    }));
  }
);

// Function to get all courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourseNames",
  async (dayname: Semana, { getState }) => {
    const state: any = getState();
    const config = getFetchConfig();

    const response: any = await axios.get<any>(
      `/api/v1/courses/${dayname}`,
      config
    );
    // Settear label y value a las materias que tienen clases hoy
    const courses: CourseTag[] = response.data.data
      .map((materia: Materia) => {
        if (!!materia.asignaciones.length) {
          return {
            ...materia,
            label: materia.nombre,
            value: materia._id,
          };
        }

        return undefined;
      })
      .filter((item: any) => item !== undefined);

    return courses;
  }
);

// Function to get all nrc
export const fetchNrcs = createAsyncThunk(
  "courses/fetchNrcs",
  async (dayname: Semana) => {
    const config = getFetchConfig();
    const response: any = await axios.get<any>(
      `/api/v1/courses/${dayname}`,
      config
    );
    const materias: Materia[] = response.data.data;

    const nrcs: any[] = materias.map((materia: Materia) => {
      return materia.asignaciones.map((asignacion: Asignacion) => {
        return {
          ...asignacion,
          materia: {
            _id: materia._id,
            nombre: materia.nombre,
          },
          label: asignacion.nrc,
          value: asignacion.nrc,
        };
      });
    });

    const data: NrcTag[] = [].concat(...nrcs);
    return data;
  }
);

// Function to get all teachers
export const fetchTeachers = createAsyncThunk(
  "courses/fetchTeachers",
  async (arg, { getState }) => {
    const config = getFetchConfig();
    const response: any = await axios.get<any>(
      `/api/v1/teachers`,
      config
    );

    const state: any = getState();
    const nrcs: NrcTag[] = state.courses.nrcs;

    // Obtener la lista total de maestros en el sistema
    const teachers: TeacherTag[] = response.data.data.map(
      (maestro: Maestro) => {
        return {
          ...maestro,
          label: maestro.nombre,
          value: maestro._id,
        };
      }
    );

    // Obtener maestros que coinciden con los nrcs de las materias que tienen clase hoy pero con duplicados
    const teachersWithCoursesDup: TeacherTag[] = nrcs
      .map((nrc: NrcTag) => {
        const data = teachers.filter(
          (teacher: Maestro) => !!nrc.maestro && teacher._id === nrc.maestro._id
        );
        return data;
      })
      .flat();

    // Eliminando duplicados en los maestros con materias
    const teachersWithCourses: TeacherTag[] = teachersWithCoursesDup.filter(
      (value: any, index: any, self: any) =>
        index ===
        self.findIndex(
          (t: TeacherTag) => t._id === value._id && t.nombre === value.nombre
        )
    );

    // Eliminar a los maestros que tienen clase hoy
    const teachersWithOutCourses: (TeacherTag | undefined)[] = teachers.filter(
      (teacher: TeacherTag) => {
        let isTeacherWithCourses = false;
        for (let teacherWithCourses of teachersWithCourses) {
          if (teacherWithCourses._id === teacher._id) {
            isTeacherWithCourses = true;
          }
        }

        return !isTeacherWithCourses;
      }
    );

    // Poner los profesores con cursos hasta el principio de la lista
    let orderedTeachers: any = [
      ...teachersWithCourses,
      ...teachersWithOutCourses,
    ];
    return orderedTeachers;
  }
);

///////////////////////////
// Slice
///////////////////////////
export const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string>) => {
      state.loanDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.classrooms = action.payload;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
      })
      .addCase(fetchNrcs.fulfilled, (state, action) => {
        state.nrcs = action.payload;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.teachers = action.payload;
      });
  },
});

export const { setDate } = courseSlice.actions;

export default courseSlice.reducer;

///////////////////////////
// Selector
///////////////////////////
export const selectClassrooms = (state: RootState) => state.courses.classrooms;
export const selectCourses = (state: RootState) => state.courses.courses;
export const selectNrcs = (state: RootState) => state.courses.nrcs;
export const selectTeachers = (state: RootState) => state.courses.teachers;
export const selectDate = (state: RootState) =>
  getDateFromISOFormat(state.courses.loanDate);
export const selectDateString = (state: RootState) => state.courses.loanDate;
