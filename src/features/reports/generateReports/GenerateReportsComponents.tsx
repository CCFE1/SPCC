import CircularProgress from "@mui/material/CircularProgress";

export const LoandingBlock = () => {
  return (
    <>
      <CircularProgress />
      <span style={{marginTop: ".8rem"}}>
        Los reportes se están generando. Por favor, ten paciencia.
      </span>
    </>
  );
};