import { useState } from "react";
import dayjs from "dayjs";
import writeXlsxFile from "write-excel-file";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { openDialog, isDate1AfterDate2, areSameDates } from "@utils/index";
import styles from "./GenerateReports.module.css";
import { LoandingBlock } from "./GenerateReportsComponents";
import { fetchReports, selectStatus, setStatus } from "@reports/reportsSlice";

// Idle
import { Button } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const schema: any = [
  {
    column: "Nombre del dispositivo",
    type: String,
    value: (row: any) => row["Nombre del dispositivo"],
  },
  {
    column: "Tiempo de uso",
    type: String,
    value: (row: any) => row["Tiempo de uso"],
  },
  {
    column: "Numero de veces usado",
    type: Number,
    value: (row: any) => row["Numero de veces usado"],
  },
  {
    column: "Desde",
    type: String,
    value: (row: any) => row.desde,
  },
  {
    column: "Hasta",
    type: String,
    value: (row: any) => row.hasta,
  },
];

export default function GenerateReports() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [initDate, setInitDate] = useState<any>(null);
  const [finalDate, setFinalDate] = useState<any>(null);

  const onClick = (e: any) => {
    const buttonType: any = e.target.getAttribute("data-type");

    if (buttonType === "custom") {
      // Si es tipo custom y no se llenaron los campos, soltar alerta
      if (!initDate || !finalDate) {
        return openDialog("Alerta", "No dejes las fechas vacias");
      }

      // Si la fecha de inicio es mayor a la final, soltar alerta
      const isInitAfterFinal = isDate1AfterDate2(
        initDate.toDate(),
        finalDate.toDate()
      );
      if (isInitAfterFinal) {
        return openDialog(
          "Alerta",
          "La fecha de inicio no puede ser mayor a la fecha de fin"
        );
      }

      const areSame = areSameDates(initDate.toDate(), finalDate.toDate());
      if (areSame) {
        return openDialog(
          "Alerta",
          "La fecha de inicio no puede ser igual a la fecha de fin"
        );
      }
    }

    // Información a enviar al servidor
    const body: any = {
      type: buttonType,
      init: !!initDate ? initDate.toDate() : "",
      final: !!finalDate ? finalDate.toDate() : "",
    };

    const fileNameComplement: any = {
      month: "mes",
      six: "seis-meses",
      custom: "personalizado",
    };

    setInitDate(null);
    setFinalDate(null);

    dispatch(fetchReports(body))
      .unwrap()
      .then(async (result: any) => {
        console.log(result);
        if (result.err) {
          return openDialog("Error", "Algo salió mal al generar los reportes");
        }

        const { logs, devices } = result.data;
        try {
          await writeXlsxFile([devices, logs], {
            schema: [schema, schema],
            sheets: ["Reporte de Dispositivos", "Reporte de Computadoras"],
            fileName: `reportes-${fileNameComplement[buttonType]}`,
          });

          openDialog("Aviso", "Si no hay tiempos de algún item, no aparecerá en la tabla. lo que genera reportes vacios en caso de no haber ningun tiempo de ningun item (En proceso de arreglar)");
        } catch (e: any) {
          console.log(e);
          openDialog("Error", "Algo salió mal al generar los reportes");
        }
      })
      .catch((e: any) => {
        console.log(e);
        openDialog("Error", "Algo salió mal al generar los reportes");
      });
  };

  return (
    <>
      {status === "loading" ? (
        <LoandingBlock />
      ) : (
        <div>
          <div className={styles.topButtons}>
            <Button
              sx={{ flexGrow: 1, marginRight: "16px" }}
              variant="contained"
              data-type="month"
              onClick={onClick}
              disableElevation
            >
              Reporte del mes
            </Button>
            <Button
              data-type="six"
              variant="contained"
              onClick={onClick}
              disableElevation
            >
              Reporte de los últimos 6 meses
            </Button>
          </div>
          <section className={styles.bottomPane}>
            <span className={styles.center}>Reporte Personalizado</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div>
                <div
                  style={{
                    display: "flex",
                    flexFlow: "column",
                    marginBottom: ".5rem",
                  }}
                >
                  <span
                    style={{
                      marginBottom: ".5rem",
                    }}
                  >
                    Fecha Inicio
                  </span>
                  <DesktopDatePicker
                    views={["month", "year"]}
                    reduceAnimations={true}
                    disableFuture={true}
                    onChange={(value: any) => {
                      setInitDate(value);
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexFlow: "column",
                    marginBottom: ".5rem",
                  }}
                >
                  <span
                    style={{
                      marginBottom: ".5rem",
                    }}
                  >
                    Fecha Final
                  </span>
                  <DesktopDatePicker
                    views={["month", "year"]}
                    reduceAnimations={true}
                    maxDate={dayjs().add(1, "month")}
                    onChange={(value: any) => {
                      setFinalDate(value);
                    }}
                  />
                </div>
              </div>
            </LocalizationProvider>
            <div
              className={styles.center}
              style={{
                marginTop: ".5rem",
              }}
            >
              <Button
                data-type="custom"
                variant="contained"
                onClick={onClick}
                disableElevation
              >
                Generar Reporte
              </Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
