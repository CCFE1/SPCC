import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Form } from "react-final-form";
import { useRouter } from "next/router";
import { Label, Button, Input } from "@ui/index";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import styles from "../create-loan-form/CreateLoanForm.module.css";

import type {
  Prestamo,
  Item,
  UpdateLoanProps,
  ModifyData,
} from "@models/interfaces";

import {
  firstValidations,
  secondValidations,
} from "../create-loan-form/createLoanValidations";

import {
  fetchActiveLoans,
  setSelectedLoanIsDisabled,
} from "../active-loans-list/activeLoansListSlice";

import {
  setStatus,
  modifyLoan,
  selectStatus,
  selectSelectedLoan,
  setSelectedLoan,
} from "./modifyLoanFormSlice";

import {
  getDate,
  openDialog,
  decodeToken,
  openAcceptDialog,
} from "@utils/index";

import {
  getDevicesToSelect,
  getDataToSend,
  getDeletedDevices,
} from "./ModifyLoanFormHelpers";

import {
  ClassroomSelector,
  CourseSelector,
  HoursSelector,
  NrcSelector,
  TeacherSelector,
} from "@courses/index";

import {
  selectDevices,
  selectStatus as selectDevicesStatus,
  selectSelectedDevices,
  clearDevices,
  setDeviceAmount,
  updateDeviceAmount,
  updateSelected,
} from "@devices/deviceSlice";
import DeviceSelector from "@devices/device-selector/DeviceSelector";

// Formulario para crear un prestamo
function ModifyLoanForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const devices: Item[] = useAppSelector(selectDevices);
  const selectedDevices: Item[] = useAppSelector(selectSelectedDevices);
  const status = useAppSelector(selectStatus);

  // Préstamo seleccionado, agrega los dispositivos seleccionados
  // al input de los dispositivos.
  const selectedLoan: Prestamo | undefined = useAppSelector(selectSelectedLoan);
  const devicesListStatus: "idle" | "loading" | "failed" =
    useAppSelector(selectDevicesStatus);
  useEffect(() => {
    if (
      !selectedLoan ||
      !!selectedDevices.length ||
      devicesListStatus !== "idle"
    )
      return;
    dispatch(clearDevices());
    const devicesToSelect: (Item | undefined)[] = getDevicesToSelect(
      devices,
      selectedLoan
    );

    // Resta la cantidad de prèstamo al dispositivo en la lista de dispositivos
    for (let device of devicesToSelect) {
      dispatch(setDeviceAmount(device as Item));
    }

    // Selecciona cada dispositivo y lo coloca en el input de dispositivos.
    for (let device of devicesToSelect) {
      const { localPrestado } = device as Item;
      for (let i = 0; i < localPrestado; i++) {
        dispatch(updateDeviceAmount(device as Item));
        dispatch(updateSelected(device as Item));
      }
    }
  }, [devicesListStatus]);

  const updateLoan = (args: UpdateLoanProps) => {
    let aula = undefined;
    if (args.formData.aulas.label !== selectedLoan?.materia.horario.aula) {
      aula = args.formData.aulas.label;
    }

    const userData: any = decodeToken();

    // Si el usuario es null, significa que no hay token
    // ésto solo es por si acaso, en teoria nadie puede acceder al sistema sin un token.
    if (!userData) {
      localStorage.clear();
      router.replace("/main");
      return;
    }

    // Obtener la informacion que se va a enviar
    const dataToSend: ModifyData[] = getDataToSend(
      selectedDevices,
      selectedLoan
    );

    // La función dataToSend no recupera los dispositivos eliminados.
    // Recuperar los dispositivos eliminados.
    const deletedDevices: (ModifyData | undefined)[] | undefined =
      getDeletedDevices(selectedDevices, selectedLoan);

    // Obtener los dispositivos que tengan cambios
    const changedDevices: ModifyData[] = dataToSend.filter(
      (device: any) => device.operation !== "idle"
    );
    // Si no hay dispositivos modificados o eliminados
    if (!changedDevices.length && !deletedDevices?.length && !aula) {
      openDialog(
        "Mensaje",
        "No se han hecho cambios en el préstamo seleccionado"
      );
      return;
    }

    // Desactivar lista para que no interfiera con el envio de la informacion
    dispatch(setSelectedLoanIsDisabled(true));
    // Enviar datos
    dispatch(
      modifyLoan({
        loanID: selectedLoan?._id as string,
        changedDevices,
        deletedDevices,
        aula,
      })
    )
      .unwrap()
      .then((result: any) => {
        if (!result.data.error) {
          dispatch(fetchActiveLoans());
          dispatch(setSelectedLoan(undefined));
        }

        dispatch(setSelectedLoanIsDisabled(false));
        openDialog("Mensaje", result.data.msg);
      })
      .catch((e) => {
        dispatch(setSelectedLoanIsDisabled(false));
        openDialog("Mensaje", "Error al conectar con el servidor");
      });
  };

  const onSubmit = (data: any, form: any) => {
    // Validaciones de campos sencillas
    let validationsResult: any = firstValidations(data, selectedDevices);
    if (!validationsResult.isValid) {
      dispatch(setStatus(validationsResult.isValid));
      return openDialog(
        validationsResult.dialog.title,
        validationsResult.dialog.description
      );
    }

    const args: UpdateLoanProps = {
      form,
      formData: data,
    };

    // Validaciones complejas relacionadas con dispositivos
    validationsResult = secondValidations(data, selectedDevices, devices);
    if (!validationsResult.isValid) {
      dispatch(setStatus(validationsResult.isValid));

      if (validationsResult.requireAcceptOption) {
        return openAcceptDialog(
          validationsResult.dialog.title,
          validationsResult.dialog.description,
          updateLoan,
          args
        );
      }

      return openDialog(
        validationsResult.dialog.title,
        validationsResult.dialog.description
      );
    }

    updateLoan(args);
  };

  return (
    <div className={styles.createLoan}>
      <Form
        onSubmit={onSubmit}
        initialValues={selectedLoan}
        mutators={{
          // expect (field, value) args from the mutator
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({
          handleSubmit,
          form: {
            mutators: { setValue },
          },
          values,
        }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Top pane */}
            <div className={styles.topPane}>
              {/* Fecha */}
              <div className={styles.formGroup}>
                <Label
                  className={styles.marginBottom}
                  text="Fecha"
                  size="16px"
                />
                <Label
                  className={styles.marginLeft}
                  text={getDate(
                    new Date(selectedLoan?.timelog.inicio as string)
                  )}
                  size="20px"
                />
              </div>

              {/* Nrc */}
              <NrcSelector
                initialValue={values}
                setValue={setValue}
                isLoading={status === "loading"}
                disabled
              />

              {/* Maestro */}
              <TeacherSelector
                initialValue={values}
                setValue={setValue}
                isLoading={status === "loading"}
                disabled
              />

              {/* Materia */}
              <CourseSelector
                initialValue={values}
                setValue={setValue}
                isLoading={status === "loading"}
                disabled
              />

              {/* Aula */}
              <ClassroomSelector
                initialValue={values}
                setValue={setValue}
                isLoading={status === "loading"}
              />

              {/* Horario */}
              <HoursSelector
                initialValue={values}
                setValue={setValue}
                isLoading={status === "loading"}
                disabled
              />
            </div>

            {/* Bottom pane */}
            <div className={styles.bottomPane}>
              {/* Selector de devices */}
              <DeviceSelector isLoading={status === "loading"} />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "76.6% 1fr",
                  gridGap: "1.6%",
                }}
              >
                {/* Input de observaciones */}
                <div
                  style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "stretch",
                  }}
                >
                  <Input
                    value={values.observaciones}
                    isLoading={status === "loading"}
                    name="observaciones"
                    placeholder="Observaciones"
                    autocomplete="off"
                    disabled
                  />
                </div>

                {/* Botón de modificar */}
                <div className={styles.btnContainer}>
                  <Button
                    type="submit"
                    text="Modificar"
                    style={{ flexGrow: 1 }}
                    disabled={status === "loading"}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
}

export default dynamic(() => Promise.resolve(ModifyLoanForm), { ssr: false });
