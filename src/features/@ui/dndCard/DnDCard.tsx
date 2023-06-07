import { useEffect, useCallback, useState } from "react";
import { IdleBlock, SuccessBlock } from "./DnDCardComponents";
import CircularProgress from "@mui/material/CircularProgress";
import type { DnDCardProps } from "@models/interfaces";
import { FileError, FileRejection, useDropzone } from "react-dropzone";
import type { StatusObjectType, StatusType } from "@models/types";
import styles from "./DnDCard.module.css";
import { openDialog } from "@utils/index";

const maxFiles: number = 1;
const maxSize: number = 5000000;
const accept: any = {
  "text/csv": [".csv"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};

export default function DnDCard(props: DnDCardProps) {
  const [fileName, setFileName] = useState<string>();
  const [msgError, setMsgError] = useState<string>();

  // Se ejecuta cuando se suelta el archivo
  const onDrop = useCallback((acceptedFiles: any) => {
    props.setStatus("loading");
    if (acceptedFiles.length > 0) {
      props.setStatus("success");
      setFileName(acceptedFiles[0].name);
      props.setValue("file", acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({ onDrop, accept, maxFiles, maxSize });
  // Hacer saber al usuario cuando sube un archivo que no está permitido
  useEffect(() => {
    if (fileRejections.length === 0) return;
    props.setStatus("idle");

    // Solo puede subirse un archivo
    if (fileRejections.length > 1) {
      return openDialog("Error", "Solo puedes subir un archivo a la vez");
    }

    // Solo se aceptan los tipos especificados en la constante accept
    const [fileError]: FileRejection[] = fileRejections;
    const invalidType: FileError | undefined = fileError.errors.find(
      (err) => err.code === "file-invalid-type"
    );
    if (invalidType) {
      return openDialog("Error", "Tipo de archivo invalido");
    }

    // El archivo sobrepasa los 5MB
    const tooLarge: FileError | undefined = fileError.errors.find(
      (err) => err.code === "file-too-large"
    );
    if (tooLarge) {
      return openDialog("Error", "Tamaño del archivo demasiado grande");
    }

    // Error por default
    openDialog("Error", "Error al cargar el archivo");
  }, [fileRejections]);

  // Cargar los bloques dependiendo del status
  const loadData = (option: StatusType) => {
    const options: StatusObjectType = {
      loading: () => <CircularProgress />,
      idle: () => <IdleBlock isDragActive={isDragActive} />,
      success: () => (
        <SuccessBlock fileName={fileName} onClick={props.onClick} />
      ),
    };

    return options[option]();
  };

  return (
    <div {...getRootProps()} className={styles.container}>
      <input {...getInputProps()} />
      {loadData(props.status)}
    </div>
  );
}
