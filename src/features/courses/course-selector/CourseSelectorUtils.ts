import {
  getDecimalHour,
  getMDYDateString,
  getDecimalMinutes,
} from "@utils/index";

export const isNear = (course: any, areConsecutive: boolean): boolean => {
  const actualHour: number = getDecimalHour();
  const actualMinutes: number = getDecimalMinutes();
  const actualDate: string = getMDYDateString(new Date());
  const actualTime: Date = new Date(
    `${actualDate} ${actualHour}:${actualMinutes}`
  );

  let existsNear = false;
  for (let horario of course.horarios) {
    // Si existen consecutivos
    if (areConsecutive) {
      // Parseando horas del horario a objetos Date
      const horaInicio = new Date(`${actualDate} ${horario.horaInicio - 1}:40`);
      const horaFin = new Date(`${actualDate} ${horario.horaFin - 1}:39`);

      // Si le faltan 20 mins para comenzar y hay consecutivos
      if (actualTime >= horaInicio && horaFin >= actualTime) {
        existsNear = true;
        break;
      }

      break;
    }

    /* 
      Si no hay consecutivos 
    */

    // Parseando horas del horario a objetos Date
    const horaInicio = new Date(`${actualDate} ${horario.horaInicio - 1}:40`);
    const horaFin = new Date(`${actualDate} ${horario.horaFin}:00`);

    if (actualTime >= horaInicio && horaFin >= actualTime) {
      existsNear = true;
      break;
    }
  }

  return existsNear;
};
