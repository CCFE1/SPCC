import dynamic from "next/dynamic";
import { Form } from "react-final-form";
import { useRouter } from "next/router";
import { Prestamo, Dispositivo } from "@models/interfaces";
import {
  uploadLoan,
  selectLoanIsLoading,
  setIsLoading,
} from "./createLoanFormSlice";
import { firstValidations, secondValidations } from "./createLoanValidations";

import {
  fetchActiveLoans,
  setSelectedLoanIsDisabled,
} from "../active-loans-list/activeLoansListSlice";

import {
  addDays,
  getDayName,
  openDialog,
  decodeToken,
  openAcceptDialog,
} from "@utils/index";

import DeviceSelector from "@devices/device-selector/DeviceSelector";
import {
  ClassroomSelector,
  CourseSelector,
  HoursSelector,
  NrcSelector,
  TeacherSelector,
  DateSelector,
} from "@courses/index";

import {
  selectDevices,
  selectSelectedDevices,
  clearDevices,
} from "@devices/deviceSlice";

import { useAppSelector, useAppDispatch } from "@store/hooks";
import { Label, Button, Input, DatePicker } from "@ui/index";

import styles from "./CreateLoanForm.module.css";

// Formulario para crear un prestamo
function CreateLoanForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectDevices);
  const selectedDevices = useAppSelector(selectSelectedDevices);
  const isLoading = useAppSelector(selectLoanIsLoading);

  const sendLoan = (args: SendLoanProps) => {
    const { form, formData } = args;

    const clearAll = (form: any) => {
      form.mutators.setValue("nrcs", "");
      form.mutators.setValue("maestros", "");
      form.mutators.setValue("materias", "");
      form.mutators.setValue("aulas", "");
      form.mutators.setValue("horaInicio", "");
      form.mutators.setValue("horaFin", "");
      form.mutators.setValue("alumnos", "");
      form.mutators.setValue("observaciones", "");
      dispatch(clearDevices());
    };

    // Si el usuario es null, significa que no hay token
    // ésto solo es por si acaso, en teoria nadie puede acceder al sistema sin un token.
    const userData: any = decodeToken();
    if (!userData) {
      localStorage.clear();
      router.replace("/main");
      return;
    }

    const { _id, nickname } = userData;
    const loan: Prestamo = {
      observaciones: formData.hasOwnProperty("observaciones")
        ? formData.observaciones
        : "",
      status: "activo",
      maestro: {
        _id: formData.maestros.value,
        nombre: formData.maestros.label,
      },
      materia: {
        _id: formData.materias.value,
        nombre: formData.materias.label,
        nrc: formData.nrcs.value,
        horario: {
          aula: formData.aulas.value,
          horaInicio: formData.horaInicio.value,
          horaFin: formData.horaFin.value,
          dia: getDayName(),
        },
      },
      dispositivos: selectedDevices.map((dispositivo: Dispositivo) => {
        return {
          _id: dispositivo._id,
          nombre: dispositivo.nombre,
          localPrestado: dispositivo.localPrestado,
          actives: dispositivo.localPrestado,
        };
      }),
      dispositivosDevueltos: [],
      usuario: {
        _id,
        nickname,
      },
      timelog: {
        inicioOriginal: new Date().toString(),
        inicio: formData.fecha.toString(),
      },
    };

    // Desactivar lista para que no interfiera con el envio
    dispatch(setSelectedLoanIsDisabled(true));
    // Enviar préstamo
    dispatch(uploadLoan(loan))
      .unwrap()
      .then((result) => {
        if (result.status === 200) {
          dispatch(setSelectedLoanIsDisabled(false));
          dispatch(fetchActiveLoans());

          clearAll(form);
          dispatch(setIsLoading(false));
          return;
        }

        dispatch(setSelectedLoanIsDisabled(false));
        openDialog("Mensaje", result.data.msg);
        dispatch(setIsLoading(false));
        return;
      })
      .catch((e) => {
        console.log(e);
        dispatch(setSelectedLoanIsDisabled(false));
        openDialog("Error", "Algo salió mal al intentar realizar un préstamo");
        dispatch(setIsLoading(false));
      });
  };

  const onSubmit = (data: any, form: any) => {
    const args: SendLoanProps = { form, formData: data };

    // Validaciones de campos sencillas
    let validationsResult: any = firstValidations(data, selectedDevices);
    if (!validationsResult.isValid) {
      dispatch(setIsLoading(validationsResult.isValid));

      if (validationsResult.requireAcceptOption) {
        return openAcceptDialog(
          validationsResult.dialog.title,
          validationsResult.dialog.description,
          sendLoan,
          args
        );
      }

      openDialog(
        validationsResult.dialog.title,
        validationsResult.dialog.description
      );
      return;
    }

    // Validaciones complejas relacionadas con dispositivos
    validationsResult = secondValidations(data, selectedDevices, devices);
    if (!validationsResult.isValid) {
      dispatch(setIsLoading(validationsResult.isValid));

      if (validationsResult.requireAcceptOption) {
        return openAcceptDialog(
          validationsResult.dialog.title,
          validationsResult.dialog.description,
          sendLoan,
          args
        );
      }

      return openDialog(
        validationsResult.dialog.title,
        validationsResult.dialog.description
      );
    }

    sendLoan(args);
  };

  return (
    <div className={styles.createLoan}>
      <Form
        onSubmit={onSubmit}
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
                <DateSelector setValue={setValue} disabled={isLoading} />
              </div>

              {/* Nrc */}
              <NrcSelector setValue={setValue} isLoading={isLoading} />

              {/* Maestro */}
              <TeacherSelector setValue={setValue} isLoading={isLoading} />

              {/* Materia */}
              <CourseSelector setValue={setValue} isLoading={isLoading} />

              {/* Aula */}
              <ClassroomSelector setValue={setValue} isLoading={isLoading} />

              {/* Horario */}
              <HoursSelector setValue={setValue} isLoading={isLoading} />
            </div>

            {/* Bottom pane */}
            <div className={styles.bottomPane}>
              {/* Selector de devices */}
              <DeviceSelector isLoading={isLoading} />

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
                    isLoading={isLoading}
                    name="observaciones"
                    placeholder="Observaciones"
                    autocomplete="off"
                    maxlength={60}
                  />
                </div>

                {/* Botón de prestar */}
                <div className={styles.btnContainer}>
                  <Button
                    type="submit"
                    text="Prestar"
                    style={{ flexGrow: 1 }}
                    disabled={isLoading}
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

export default dynamic (() => Promise.resolve(CreateLoanForm), {ssr: false});

interface SendLoanProps {
  form: any;
  formData: any;
}
