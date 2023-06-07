import { HeadCell } from "@models/interfaces";

const data: HeadCell[] = [
  {
    id: "fecha",
    numeric: true,
    disablePadding: true,
    label: "Fecha ",
    disableSort: false,
  },
  {
    id: "nrc",
    numeric: true,
    disablePadding: true,
    label: "Nrc ",
    disableSort: false,
  },
  {
    id: "nombre",
    numeric: false,
    disablePadding: true,
    label: "Nombre ",
    disableSort: false,
  },
  {
    id: "materia",
    numeric: false,
    disablePadding: true,
    label: "Materia ",
    disableSort: false,
  },
  {
    id: "aula",
    numeric: false,
    disablePadding: true,
    label: "Aula ",
    disableSort: false,
  },
  {
    id: "inicio",
    numeric: true,
    disablePadding: true,
    label: "Inicio ",
    disableSort: false,
  },
  {
    id: "fin",
    numeric: true,
    disablePadding: true,
    label: "Fin ",
    disableSort: false,
  },
  {
    id: "dispositivos",
    numeric: false,
    disablePadding: true,
    label: "Dispositivos ",
    disableSort: true,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Status ",
    disableSort: false,
  },
  {
    id: "creacion",
    numeric: true,
    disablePadding: true,
    label: "Creación ",
    disableSort: true,
  },
  {
    id: "creador",
    numeric: false,
    disablePadding: true,
    label: "Creador ",
    disableSort: false,
  },
  {
    id: "observaciones",
    numeric: false,
    disablePadding: true,
    label: "Observaciones ",
    disableSort: false,
  },
]

// Aqui se filtran las opciones de las columnas.
export const getHeadCells = (rol: any) => {
  const newData: HeadCell[] = data.filter((headCell: HeadCell) => {
    // Si la persona no es admin, excluimos la columna creación.
    if (rol !== "admin" && headCell.id === "creacion") return false;
    return true;
  });

  return newData;
};