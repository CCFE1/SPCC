import Alert from "@mui/material/Alert";
import { Form } from "react-final-form";
import { DnDCard, SwitchInput } from "@ui/index";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { StatusType } from "@models/types";
import { openDialog } from "@utils/index";
import readXlsxFile from "read-excel-file";

import {
  selectStatus,
  setStatus,
  uploadSchedules,
} from "./uploadScheduleSlice";

const map: any = {
  "EE": "EE",
  NRC: "NRC",
  LUNES: "LUNES",
  "LUNES-AULA": "LUNES-AULA",
  MARTES: "MARTES",
  "MARTES-AULA": "MARTES-AULA",
  MIERCOLES: "MIERCOLES",
  "MIERCOLES-AULA": "MIERCOLES-AULA",
  JUEVES: "JUEVES",
  "JUEVES-AULA": "JUEVES-AULA",
  VIERNES: "VIERNES",
  "VIERNES-AULA": "VIERNES-AULA",
  CATEDRATICO: "CATEDRATICO",
};

export default function UploadSchedule() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const onSubmit = async (data: any) => {
    const { file, borrar } = data;
    // Transformando el excel a json
    const { rows, errors } = await readXlsxFile(file, { map });
    if (errors.length > 0) {
      dispatch(setStatus("idle"));
      return openDialog("UPS!", "Revisa tu excel, algo salió mal al leerlo");
    }

    const body: any = {
      borrar,
      schedules: rows,
    }

    // Subir los horarios transformados y la opción de eliminar los anteriores horarios.
    dispatch(uploadSchedules(body))
      .unwrap()
      .then(({ status }) => {
        if (status === 200) {
          return openDialog(
            "Mensaje",
            "Los horarios se subieron correctamente"
          );
        }

        openDialog(
          "Error",
          "Algo salió mal al subir los horarios. Consulte a su administrador inmediatamente"
        );
      })
      .catch((err) => {
        openDialog("Error", "Error al conectar con el servidor");
      });
  };

  const setNewStatus = (newStatus: StatusType) => {
    dispatch(setStatus(newStatus));
  };

  return (
    <Form
      initialValues={{ borrar: true }}
      onSubmit={onSubmit}
      mutators={{
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
        <form onSubmit={handleSubmit}>
          <SwitchInput />
          <DnDCard
            setValue={setValue}
            status={status}
            setStatus={setNewStatus}
          />
          <Alert
            severity="info"
            sx={{ borderRadius: "var(--radius-medium)", marginTop: ".8rem" }}
          >
            Asegurate de que los horarios sigan el siguiente formato:
            <a href="downloads/formato_ejemplo.xlsx">
              {" "}
              Click aquí para descargar el formato
            </a>
          </Alert>
        </form>
      )}
    />
  );
}
