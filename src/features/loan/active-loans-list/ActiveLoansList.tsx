import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Prestamo } from "@models/interfaces";
import { LoadingTableBody, TableMessage } from "@ui/index";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import ActiveLoansListRow from "./active-loans-list-row/ActiveLoansListRow";
import styles from "./ActiveLoansList.module.css";

import {
  searchExpiredLoans,
  reorderActiveLoans,
} from "./ActiveLoansListHelpers";

import {
  fetchActiveLoans,
  selectActiveLoans,
  setActiveLoans,
  selectStatus,
  setStatus,
} from "./activeLoansListSlice";

function ActiveLoansList() {
  const dispatch: any = useAppDispatch();
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchActiveLoans());
    return () => {
      dispatch(setStatus("loading"));
    };
  }, []);

  const activeLoans = useAppSelector(selectActiveLoans);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );
  useEffect(() => {
    // Si existe un intervalo anterior, limpiarlo
    if (!!intervalId) clearInterval(intervalId);
    // Si la lista está vacia, no crear intervalo
    if (!activeLoans || !activeLoans.length) return;

    // Crear intervalo con proceso para verificar los préstamos activos
    const interval: NodeJS.Timeout = setInterval(() => {
      const expiredLoans: Prestamo[] | undefined =
        searchExpiredLoans(activeLoans);
      if (!!expiredLoans) {
        const reorderedLoans: Prestamo[] = reorderActiveLoans(expiredLoans);
        dispatch(setActiveLoans(reorderedLoans));
      }
    }, 1000);

    setIntervalId(interval);

    return () => clearInterval(intervalId);
  }, [activeLoans]);

  /* Cargar información dependiendo del status */
  const loadTable = () => {
    const options: any = {
      loading: () => <LoadingTableBody columnsNumber={10} rowsNumber={5} />,
      failed: () => (
        <TableMessage msg="Error al obtener la lista de préstamos del servidor" />
      ),
      idle: () => {
        // En caso de que al terminar de cargar no haya préstamos, mostrar mensaje respectivo
        return !!activeLoans.length ? (
          activeLoans.map((loan: Prestamo, index: number) => (
            <ActiveLoansListRow id={index} key={index} prestamo={loan} />
          ))
        ) : (
          <TableMessage msg="No hay préstamos que mostrar" />
        );
      },
    };

    return options[status]();
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.tableFixHead}>
        <table className={styles.activeListTable}>
          <thead>
            <tr className={styles.tHeadFixedTr}>
              <th className="f-center">Fecha</th>
              <th className="f-center">Nrc</th>
              <th className="f-center">Nombre</th>
              <th className="f-center">Materia</th>
              <th className="f-center">Aula</th>
              <th className="f-center">Inicio</th>
              <th className="f-center">Fin</th>
              <th className="f-center">Dispositivos</th>
              <th className="f-center">Observaciones</th>
              <th className="f-center">Acciones</th>
            </tr>
          </thead>
          <tbody
            className={`${styles.tableFixHeadBody} scrollbar`}
            style={{
              display: "flex",
              flexFlow: "column",
            }}
          >
            {loadTable()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default dynamic (() => Promise.resolve(ActiveLoansList), {ssr: false})
