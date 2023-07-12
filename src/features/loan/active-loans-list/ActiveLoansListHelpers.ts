import { Prestamo } from "@models/interfaces";
import {
  getDecimalHour,
  getDateFromISOFormat,
  setHourToDate,
  isDate1AfterDate2,
} from "@utils/index";

// Buscar préstamos expirados
export const searchExpiredLoans = (
  activeLoans: Prestamo[],
): Prestamo[] | undefined => {
  let isChanged: boolean = false;
  const actualHour: number = getDecimalHour();
  const today: Date = getDateFromISOFormat();
  // Actualizar los préstamos activos de manera local
  const updatedActiveLoans: Prestamo[] = activeLoans.map(
    (prestamo: Prestamo) => {
      // Obtener fecha de inicio del préstamo
      const loanDate: Date = getDateFromISOFormat(prestamo.timelog.inicio);
      // Agregar hora del préstamo a la fecha del préstamo
      const completeLoanDate: Date = setHourToDate(
        loanDate,
        prestamo.materia.horario.horaFin,
      );

      // Almacenar si la fecha y hora de hoy es mayor a la fecha de préstamo
      const isTodayAfterLoanDate: boolean = isDate1AfterDate2(
        today,
        completeLoanDate,
      );
      // Si la fecha del préstamo es mayor a la actual, y no tiene el status de deuda
      // Se actualiza el status a deuda.
      if (isTodayAfterLoanDate && prestamo.status !== "deuda") {
        isChanged = true;
        return {
          ...prestamo,
          status: "deuda",
        };
      }

      return prestamo;
    },
  );

  return isChanged ? updatedActiveLoans : undefined;
};

// Ordena los préstamos por prioridad.
export const reorderActiveLoans = (loans: Prestamo[]): Prestamo[] => {
  const loansWithDebt: Prestamo[] = getLoanByStatus(loans, "deuda");
  const nearLoans: Prestamo[] = getLoanByStatus(loans, "entrante");
  const activeLoans: Prestamo[] = getLoanByStatus(loans, "activo");
  const inactiveLoans: Prestamo[] = getLoanByStatus(loans, "inactivo");

  return [...loansWithDebt, ...nearLoans, ...activeLoans, ...inactiveLoans];
};

// Obtener préstamos dependiendo del status
const getLoanByStatus = (
  loans: Prestamo[],
  status: "entrante" | "activo" | "deuda" | "inactivo",
): Prestamo[] => {
  return loans.filter((loan: Prestamo) => loan.status === status);
};
