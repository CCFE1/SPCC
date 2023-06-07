import { Prestamo } from "@models/interfaces";
import { getDate } from "@utils/index";

export const getRowsData = (data: any) => {
  return data.map((prestamo: Prestamo) => {
    const { horaFin } = prestamo.materia.horario;
    const { horaInicio } = prestamo.materia.horario;

    const inicio = horaInicio < 10 ? `0${horaInicio}` : horaInicio;
    const fin = horaFin < 10 ? `0${horaFin}` : horaFin;

    return {
      fecha: getDate(new Date(prestamo.timelog.inicio)),
      nrc: prestamo.materia.nrc,
      nombre: prestamo.maestro.nombre,
      materia: prestamo.materia.nombre,
      aula: prestamo.materia.horario.aula,
      inicio: `${inicio}:00`,
      fin: `${fin}:00`,
      status: prestamo.status,
      creacion: prestamo.timelog.inicioOriginal,
      creador: prestamo.usuario.nickname,
      observaciones: prestamo.observaciones,
      dispositivos: prestamo.dispositivos,
      dispositivosDevueltos: prestamo.dispositivosDevueltos,
    };
  });
};
