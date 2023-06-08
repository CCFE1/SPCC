import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { openDialog } from "@utils/index";
import styles from "./GenerateReports.module.css";
import { fetchReports, selectStatus, setStatus } from "@reports/reportsSlice";

// Idle
import { Button } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export default function GenerateReports() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [initDate, setInitDate] = useState<any>(null);
  const [finalDate, setFinalDate] = useState<any>(null);

  const onClick = (e: any) => {
    const buttonType: any = e.target.getAttribute("data-type");
    const body: any = {
      type: buttonType,
      init: !!initDate ? initDate.toDate() : "",
      final: !!finalDate ? finalDate.toDate() : "",
    };

    dispatch(fetchReports(body))
      .unwrap()
      .then((result: any) => {
        console.log(result);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  return (
    <>
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
    </>
  );
}
