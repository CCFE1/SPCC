import { useState, useEffect } from "react";
import { Button, CheckboxList } from "@ui/index";
import { useAppDispatch } from "@store/hooks";
import { returnLoanAction } from "./ReturnLoanButtonActions";
import type { MouseElementEvent, Semana } from "@models/types";

import type {
  Tag,
  ReturnLoanData,
  ReturnLoanButtonProps,
  MetaDispositivo,
} from "@models/interfaces";

import {
  openDialog,
  openAcceptDialog,
  getDayName,
  getDateFromISOFormat,
} from "@utils/index";

export default function ReturnLoanButton(props: ReturnLoanButtonProps) {
  const dispatch = useAppDispatch();
  const [actualChecked, setActualChecked] = useState<Tag[]>([]);
  const [returnLoan, setReturnLoan] = useState<boolean>(false);
  const [itemList, setItemList] = useState<Tag[]>([]);

  // Los dispositivos deben ser cargados al inicio.
  useEffect(() => {
    const dispositivos = props.dispositivos.map((device: MetaDispositivo) => {
      return {
        id: device._id,
        label: device.nombre,
        value: device.localPrestado,
      };
    });

    setItemList(dispositivos);
    setActualChecked(dispositivos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dispositivos]);

  // Esto obtiene de forma mas precisa en valor actual de
  // los dispositivos seleccionados al momento de enviar la lista al
  // servidor.
  useEffect(() => {
    if (!returnLoan || !actualChecked) return;
    if (!actualChecked.length) {
      setTimeout(() => {
        openDialog(
          "Mensaje",
          "Selecciona al menos un dispositivo para devolver",
        );
      }, 20);
      setReturnLoan(false);
      return;
    }

    if (!props.loanID) {
      setTimeout(() => {
        openDialog("Error", "Algo salió mal al regresar el préstamo  :(");
      }, 20);
      setReturnLoan(false);
      return;
    }

    const date: Date = getDateFromISOFormat();
    const dayname: Semana = getDayName(date);
    const returnData: ReturnLoanData = {
      loanID: props.loanID,
      returnedDevices: actualChecked,
    };

    returnLoanAction(dispatch, dayname, returnData);
    setReturnLoan(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, returnLoan, actualChecked]);

  const returnLoanHandler = () => {
    setReturnLoan(true);
  };

  const toggleListMiddler = (checked: Tag[]) => setActualChecked(checked);

  const onClick = (e: MouseElementEvent) => {
    e.stopPropagation();
    openAcceptDialog(
      "Lista de dispositivos a devolver:",
      <CheckboxList itemList={itemList} callback={toggleListMiddler} />,
      returnLoanHandler,
    );
  };

  return <Button text="Devolver" style={{ flexGrow: 1 }} onClick={onClick} />;
}
