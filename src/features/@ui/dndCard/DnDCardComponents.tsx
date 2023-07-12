import DescriptionIcon from "@mui/icons-material/Description";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import type { IdleBlockProps, SuccessBlockProps } from "@models/interfaces";
import Button from "@mui/material/Button";

const iconStyle = {
  fontSize: 90,
  color: "#9e9e9e",
  marginBottom: ".4rem",
};

export const IdleBlock = (props: IdleBlockProps) => {
  return (
    <>
      <FileUploadIcon sx={iconStyle} />
      {props.isDragActive ? (
        <span>Suelta el archivo aquí</span>
      ) : (
        <>
          <span style={{ marginBottom: ".3rem" }}>
            Clic aquí o arrastra y suelta para cargar el archivo
          </span>
          <em>(Solo *.csv, *.xls y *.xlsx. Max. 5MB)</em>
        </>
      )}
    </>
  );
};

export const SuccessBlock = (props: SuccessBlockProps) => {
  const propagationDisabled = (e: any) => {
    e.stopPropagation();
    props.onClick && props.onClick(e);
  };

  return (
    <>
      <DescriptionIcon sx={iconStyle} />
      <span>{props.fileName}</span>
      <Button
        type="submit"
        variant="contained"
        size="small"
        onClick={propagationDisabled}
        sx={{
          backgroundColor: "#2196f3",
          marginTop: ".8rem",
          padding: "5px 1.5rem",
        }}
        disableElevation
      >
        Subir
      </Button>
    </>
  );
};
