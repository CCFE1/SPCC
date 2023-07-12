import CircularProgress from "@mui/material/CircularProgress";

export const LoandingBlock = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "column",
      }}
    >
      <CircularProgress />
      <span style={{ marginTop: ".8rem" }}>
        Los reportes se están generando. Por favor, ten paciencia.
      </span>
    </div>
  );
};
