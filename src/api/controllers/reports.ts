import { Collection } from "mongodb";
import type { Log } from "@models/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAll, DbServiceResponse } from "../services/dbServices";
import { isBetweenDates, setDayToDate, subtractMonths } from "@utils/index";

export const generateReports = async (
  req: NextApiRequest,
  res: NextApiResponse,
  devicesCollection: Collection,
  loansCollection: Collection,
  logsCollection: Collection,
) => {
  const { type, init, final } = req.body;

  // Obtenemos los dispositivos
  const devicesRes: DbServiceResponse = await getAll(devicesCollection);
  if (devicesRes.err) {
    return res.status(501).json({
      err: true,
      msg: "Error en el servidor al crear los reportes"
    });
  }
  const devices = devicesRes.data;

  // Obtener los prestamos realizados
  const loansRes: DbServiceResponse = await getAll(loansCollection);
  if (loansRes.err) {
    return res.status(501).json({
      err: true,
      msg: "Error en el servidor al crear los reportes"
    });
  }
  // Se filtran los préstamos para obtener los datos relevantes
  const loans: any = loansRes.data
    .filter((loan: any) => loan.status !== "active")
    .map((loan: any) => {
      return {
        dispositivos: loan.dispositivos,
        dispositivosDevueltos: loan.dispositivosDevueltos,
        timelog: loan.timelog,
      }
    });

  // Las opciones para obtener las fechas con las cuales se va a comparar la fecha 
  // individual de cada dispositivo prestado y log.
  const options: any = {
    month: () => {
      return {
        initialDate: getLastMonthsDate(1),
        finalDate: new Date(),
      }
    },
    six: () => {
      return {
        initialDate: getLastMonthsDate(6),
        finalDate: new Date(),
      }
    },
    custom: () => {
      return {
        initialDate: new Date(init),
        finalDate: new Date(final),
      }
    }
  }

  const {initialDate, finalDate} = options[type]();
  // Obtener los préstamos de un lapso de tiempo
  const loansBetweenDates: any = loans.filter((loan: any) => {
    const loanDate: Date = new Date(loan.timelog.inicioOriginal)
    return isBetweenDates(loanDate, initialDate, finalDate);
  });

  // Obtenemos los logs
  const logsRes: DbServiceResponse = await getAll(logsCollection);
  if (logsRes.err) {
    return res.status(501).json({
      err: true,
      msg: "Error en el servidor al crear los reportes"
    });
  }

  const logsBetweenDates: any = logsRes.data.filter((log: any) => {
    const startDate: Date = new Date(log.startDate);
    return isBetweenDates(startDate, initialDate, finalDate);
  });

  console.log(logsBetweenDates);

  return res.json({
    err: false,
    msg: "Reportes guardados correctamente",
  });
};

///////////////////
// Helper
/////////////////
function getLastMonthsDate(monthsToSubtract: number): Date {
  const todayDate: Date = new Date();
  const lastMonth: Date = subtractMonths(todayDate, monthsToSubtract);
  return setDayToDate(lastMonth, 1);
}
