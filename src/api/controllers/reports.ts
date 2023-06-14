import { Collection } from "mongodb";
import type { Log } from "@models/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAll, DbServiceResponse } from "../services/dbServices";
import {
  getDate,
  isBetweenDates,
  setDayToDate,
  subtractMonths,
  getTimeBetweenTwoHours,
} from "@utils/index";

export const generateReports = async (
  req: NextApiRequest,
  res: NextApiResponse,
  devicesCollection: Collection,
  loansCollection: Collection,
  logsCollection: Collection
) => {
  const { type, init, final } = req.body;

  // Las opciones para obtener las fechas con las cuales se va a comparar la fecha
  // individual de cada dispositivo prestado y log.
  const options: any = {
    month: () => {
      return {
        initialDate: getLastMonthsDate(0),
        finalDate: new Date(),
      };
    },
    six: () => {
      return {
        initialDate: getLastMonthsDate(6),
        finalDate: new Date(),
      };
    },
    custom: () => {
      return {
        initialDate: new Date(init),
        finalDate: new Date(final),
      };
    },
  };
  const { initialDate, finalDate } = options[type]();

  // Obtenemos los dispositivos
  const devicesRes: DbServiceResponse = await getAll(devicesCollection);
  if (devicesRes.err) {
    return res.status(501).json({
      err: true,
      msg: "Error en el servidor al crear los reportes",
    });
  }
  const devices = devicesRes.data;

  // Obtener los prestamos realizados
  const loansRes: DbServiceResponse = await getAll(loansCollection);
  if (loansRes.err) {
    return res.status(501).json({
      err: true,
      msg: "Error en el servidor al crear los reportes",
    });
  }
  // Se filtran los préstamos para obtener los datos relevantes
  const loans: any = loansRes.data
    .filter((loan: any) => loan.status !== "active")
    .map((loan: any) => {
      return {
        dispositivosDevueltos: loan.dispositivosDevueltos,
        timelog: loan.timelog,
      };
    });

  // Obtener los préstamos de un lapso de tiempo
  const loansBetweenDates: any = loans.filter((loan: any) => {
    const loanDate: Date = new Date(loan.timelog.inicioOriginal);
    return isBetweenDates(loanDate, initialDate, finalDate);
  });

  // Obtener los logs de la base de datos
  const logsRes: DbServiceResponse = await getAll(logsCollection);
  if (logsRes.err) {
    return res.status(501).json({
      err: true,
      msg: "Error en el servidor al crear los reportes",
    });
  }

  // Se obtiene el reporte de tiempo de los logs
  const logsReport = getLogsReport(logsRes, initialDate, finalDate);

  // Se obtinene el reporte de tiempo de los dispositivos.
  const devicesReport = getDevicesReport(
    devices,
    loansBetweenDates,
    initialDate,
    finalDate
  );

  return res.json({
    err: false,
    msg: "Reportes guardados correctamente",
    data: {
      logs: logsReport,
      devices: devicesReport,
    },
  });
};

///////////////////
// Helpers
/////////////////
function getDevicesReport(
  devices: any,
  loans: any,
  initialDate: Date,
  finalDate: Date
) {
  // Cada préstamo tiene una lista de dispositivos devueltos. Se busca en esa lista cada dispositivo
  // de la base de datos. Y se regresa una lista con los timelogs de cada dispositivo.
  const devicesTime = devices.map((device: any) => {
    const times = loans
      .map((loan: any) => {
        const isDeviceFinded: boolean = loan.dispositivosDevueltos.some(
          (loanDevice: any) => loanDevice.nombre === device.nombre
        );

        if (isDeviceFinded) {
          return {
            timelogs: loan.timelog,
          };
        }

        return;
      })
      .filter((i: any) => !!i);

    return {
      nombre: device.nombre,
      times,
    };
  });

  // Convertir cada timelog devuelto a horas minutos y segundos antes de sumarlos.
  const countedDevicesTime = devicesTime.map((deviceTime: any) => {
    const { nombre, times } = deviceTime;
    const countedDeviceUsageTime = times.map(({ timelogs }: any) => {
      const startDate: Date = new Date(timelogs.inicioOriginal);
      const endDate: Date = new Date(timelogs.fin);
      return getTimeBetweenTwoHours(startDate, endDate);
    });

    return {
      nombre,
      times: countedDeviceUsageTime,
    };
  });

  // Sumar todos los tiempos y llevar un conteo de veces usado
  const countedTimes = countedDevicesTime.map(({ nombre, times }: any) => {
    const addedTimes = times.reduce((acc: any, time: any) => {
      if (acc.hasOwnProperty(nombre)) {
        const newHours: number = acc[nombre].horas + time.horas;
        const newMinutes: number = acc[nombre].minutos + time.minutos;
        const newSeconds: number = acc[nombre].segundos + time.segundos;

        return {
          ...acc,
          [nombre]: {
            horas: newHours,
            minutos: newMinutes,
            segundos: newSeconds,
            timesused: acc[nombre].timesused + 1,
          },
        };
      }

      return {
        ...acc,
        [nombre]: {
          ...time,
          timesused: 1,
        },
      };
    }, {});
    return addedTimes;
  });

  // Normalizar los tiempos para convertir los segs a mins, los mins a hrs.
  return countedTimes
    .map((item: any) => normalizeTimes(item, initialDate, finalDate))
    .flat();
}

function getLogsReport(
  logsRes: DbServiceResponse,
  initialDate: Date,
  finalDate: Date
) {
  // Filtrar los logs entre fechas
  const logsBetweenDates: any = logsRes.data.filter((log: any) => {
    const startDate: Date = new Date(log.startDate);
    return isBetweenDates(startDate, initialDate, finalDate);
  });

  // Contar el tiempo total de los logs
  const logsTimeCounter = logsBetweenDates.reduce((acc: any, curr: any) => {
    const pcname: string =
      curr.pcname.length === 0 ? "DEFAULT-NAME" : curr.pcname;

    const startDate: Date = new Date(curr.startDate);
    const endDate: Date = new Date(curr.endDate);
    const timeusage: any = getTimeBetweenTwoHours(startDate, endDate);

    if (acc.hasOwnProperty(pcname)) {
      const newHours: number = acc[pcname].horas + timeusage.horas;
      const newMinutes: number = acc[pcname].minutos + timeusage.minutos;
      const newSeconds: number = acc[pcname].segundos + timeusage.segundos;

      return {
        ...acc,
        [pcname]: {
          horas: newHours,
          minutos: newMinutes,
          segundos: newSeconds,
          timesused: acc[pcname].timesused + 1,
        },
      };
    }

    return {
      ...acc,
      [pcname]: {
        ...timeusage,
        timesused: 1,
      },
    };
  }, {});

  // Normalizar el conteo total del tiempo de uso.
  // Suma todo el tiempo, transformando los segs a mins y mins a hrs.
  return normalizeTimes(logsTimeCounter, initialDate, finalDate);
}

function normalizeTimes(times: any, initialDate: Date, finalDate: Date) {
  // Normalizar el conteo total del tiempo de uso.
  // Suma todo el tiempo, transformando los segs a mins y mins a hrs.
  return Object.entries(times).map(([key, value]: any) => {
    const seconds: any =
      value.segundos / 60 >= 1
        ? {
            newVal: value.segundos % 60,
            toMinutes: Math.floor(value.segundos / 60),
          }
        : {
            newVal: value.segundos,
            toMinutes: 0,
          };

    const newMinutes: number = value.minutos + seconds.toMinutes;
    const minutes: any =
      newMinutes / 60 >= 1
        ? {
            newVal: newMinutes % 60,
            toHours: Math.floor(newMinutes / 60),
          }
        : {
            newVal: newMinutes,
            toHours: 0,
          };

    const horas: number = value.horas + minutes.toHours;
    const minutos: number = minutes.newVal;
    const segundos: number = seconds.newVal;
    return {
      "Nombre del dispositivo": key,
      "Tiempo de uso": `${horas}hrs ${minutos}mins ${segundos}segs`,
      "Numero de veces usado": value.timesused,
      desde: getDate(initialDate),
      hasta: getDate(finalDate),
    };
  });
}

function getLastMonthsDate(monthsToSubtract: number): Date {
  const todayDate: Date = new Date();
  const lastMonth: Date = subtractMonths(todayDate, monthsToSubtract);
  return setDayToDate(lastMonth, 1);
}
