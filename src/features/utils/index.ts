import dayjs, { Dayjs } from "dayjs";
import jwtDecode from "jwt-decode";
import { AlertDialog } from "@ui/index";
import { Semana, LoanInputName } from "@models/types";

//////////////////////////////
// Time Utils
/////////////////////////////
import "dayjs/locale/es";
import isBetween from "dayjs/plugin/isBetween";

dayjs.locale("es");
dayjs.extend(isBetween);

// Agregar dias a una fecha
export const addDays = (date: Date, days: number): Date => {
  const newDate: Date = dayjs(date).add(days, "day").toDate();
  return newDate;
};

export const subtractMonths = (date: Date, months: number) => {
  const newDate: Date = dayjs(date).subtract(months, "month").toDate();
  return newDate;
}

// Agregar horas a una hora
export const addHoursToHour = (hour: number, toAdd: number): Dayjs => {
  const formatedHour: Dayjs = dayjs().hour(hour).add(toAdd, "hour");
  return formatedHour;
};

// Formatear una hora
export function getHourFormated(date: Date): string {
  const horaFormateada = dayjs(date).format("HH:mm");
  return horaFormateada;
}

// Setear una hora especifica a una fecha
export const setHourToDate = (date: Date, hour: number): Date => {
  const hourAdded = dayjs(date).hour(hour).toDate();
  return hourAdded;
};

export const setDayToDate = (date: Date, day: number): Date => {
  const dayAdded = dayjs(date).day(day).toDate();
  return dayAdded;
}

// Obtener una fecha en formato iso 8601
export const getDateISOFormat = (date?: Date): string =>
  dayjs(date ?? undefined).format();

// Obtener date de fecha en formato iso 8601
export const getDateFromISOFormat = (date?: string): Date =>
  dayjs(date ?? undefined).toDate();

// Obtener string de la hora en el formato dd/mm/yyyy
export const getDate = (date?: Date): string => {
  const formatedDate: string = dayjs(date ?? undefined).format("DD/MM/YYYY");
  return formatedDate;
};

// Obtener fecha en formato MM/DD/YYYY
export const getMDYDateString = (date?: Date): string => {
  const formatedDate: string = dayjs(date ?? undefined).format("MM/DD/YYYY");
  return formatedDate;
};

/* Obtener los numeros decimales de la fecha */
export const getDecimalMinutes = (date?: Date): number =>
  dayjs(date ?? undefined).minute();
export const getDecimalHour = (date?: Date): number =>
  dayjs(date ?? undefined).hour();
export const getDecimalDay = (date?: Date): number =>
  dayjs(date ?? undefined).day();

// Obtener nombre del dia
export const getDayName = (date?: Date): Semana => {
  const today: Semana = dayjs(date ?? undefined)
    .format("dddd")
    .toLowerCase() as Semana;
  return today;
};

// Transforma la hora en decimal enviada al formato de fecha ISOString
export const getDayjsFormatByHour = (hour?: number): Dayjs => {
  const time = new Date();
  if (!!hour) time.setHours(hour);

  time.setMinutes(0);
  time.setSeconds(0);

  return dayjs(time.toISOString());
};

// Saber si dos fechas son iguales
export const areSameDates = (date1: Date, date2: Date): boolean => {
  const dayte1: Dayjs = dayjs(date1);
  return dayte1.isSame(date2, "day");
};

// Saber si una fecha es despues de otra fecha
export const isDate1AfterDate2 = (date1: Date, date2: Date): boolean => {
  const dayte1: Dayjs = dayjs(date1);
  return dayte1.isAfter(date2);
};

export const isBetweenDates = (
  dateToCompare: Date, 
  initDate: Date, 
  finalDate: Date
): boolean => {
  const init: Dayjs = dayjs(initDate);
  const final: Dayjs = dayjs(finalDate);
  return dayjs(dateToCompare).isBetween(init, final);
}

export const getTimeBetweenTwoHours = (
  initDate: Date, 
  finalDate: Date
) => {
  const diferencia: number = finalDate.getTime() - initDate.getTime(); // diferencia en milisegundos

  let segundos: number = Math.floor(diferencia / 1000);
  let minutos: number = Math.floor(segundos / 60);
  let horas: number = Math.floor(minutos / 60);

  segundos = segundos % 60;
  minutos = minutos % 60;

  return {
    horas,
    minutos,
    segundos,
  }
}

//////////////////////////////
// JWT Utils
/////////////////////////////
export const decodeToken = (): any => {
  const token: string | null = localStorage.getItem("token");
  return !!token ? jwtDecode(token) : null;
};

//////////////////////////////
// Dialog Utils
/////////////////////////////
const basicConfigs: any = {
  width: "18em",
  padding: "0",
  showClass: {
    popup: "animate__animated animate__fadeInDown",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutUp",
  },
};

export const openDialog = (title: string, text: string | JSX.Element) => {
  const content: any = typeof text === "string" ? { text } : { html: text };
  AlertDialog.fire({
    title,
    ...basicConfigs,
    ...content,
  });
};

export const openAcceptDialog = (
  title: string,
  text: string | JSX.Element,
  callback: (args?: any) => void,
  args?: any
) => {
  const content: any = typeof text === "string" ? { text } : { html: text };
  AlertDialog.fire({
    title,
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    ...basicConfigs,
    ...content,
  }).then((result) => {
    if (result.isConfirmed) {
      callback(args);
    }
  });
};

//////////////////////////////
// Form Utils
/////////////////////////////
export const resetFormInputs = (setValue: any, inputs: LoanInputName[]) => {
  inputs.forEach((inputName: LoanInputName) => {
    setValue(inputName, "");
  });
};

//////////////////////////////
// API Utils
/////////////////////////////
export const getFetchConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

////////////////////////////////////
// @ Misc
////////////////////////////////////
export function reemplazarAcentos(str: string) {
  const mapaAcentos: any = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    Á: "A",
    É: "E",
    Í: "I",
    Ó: "O",
    Ú: "U",
  };

  // Utilizamos una expresión regular para buscar y reemplazar los caracteres acentuados
  return str.replace(/[áéíóúÁÉÍÓÚ]/g, function (match: any) {
    return mapaAcentos[match];
  }).replace("\n", " ");
}

export function removeDupString(arr: string[]) {
  return arr
    .reduce((acc: string[], char: string) => {
      const isThere = acc.some(
        (str: string) => {
          const actualStr = reemplazarAcentos(str);
          const oldChar = reemplazarAcentos(char);

          return actualStr === oldChar;
        }
      );

      if (!isThere) {
        return [...acc, char.replace("\n", " ")];
      }

      return acc;
    }, [])
    .sort();
}

export function removeDup(arr: any) {
  const dataArr = new Set(arr);
  return [...dataArr].sort();
}
