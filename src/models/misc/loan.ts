import type { StatusType, Semana } from "@models/types";
import type { Tag } from "@models/interfaces";

/**
 * @loans
 * Estas son interfaces que pertenecen a
 * las features de loan
 * */
export interface Usuario {
  readonly _id: string;
  readonly nickname: string;
  readonly pass: string;
  readonly rol: "common" | "admin";
}

export interface Horario {
  aula: string;
  horaInicio: number;
  horaFin: number;
  dia: Semana;
}

export interface Maestro {
  readonly _id: string;
  readonly nombre: string;
}

export interface Asignacion {
  nrc?: string;
  maestro?: Maestro;
  horarios: Horario[];
}

export interface Materia {
  readonly _id: string;
  readonly nombre: string;
  readonly asignaciones: Asignacion[];
}

export interface MetaDispositivo {
  _id: string;
  nombre: string;
  localPrestado: number;
  // Numero de dispositivos activos
  actives: number;
}

export interface Dispositivo extends MetaDispositivo {
  stock: number;
  prestado: number;
}

export interface Prestamo {
  _id?: string;
  observaciones: string;
  status: "entrante" | "activo" | "deuda" | "inactivo";
  maestro: {
    _id: string;
    nombre: string;
  };
  materia: {
    _id: string;
    nombre: string;
    nrc: string;
    horario: Horario;
  };
  dispositivos: MetaDispositivo[];
  dispositivosDevueltos: MetaDispositivo[];
  usuario: {
    _id: string;
    nickname: string;
  };
  timelog: {
    inicioOriginal: string;
    inicio: string;
    fin?: string;
  };
}

/*
 * @props
 * Props necesarias en los componentes.
 * */
export interface ActiveLoansListRowProps {
  id: number;
  prestamo: Prestamo;
}

export interface UpdateLoanProps {
  form: any;
  formData: any;
}

export interface ReturnLoanButtonProps {
  loanID?: string;
  dispositivos: MetaDispositivo[];
}

export interface DispositivosProps {
  dispositivos: MetaDispositivo[];
}

/*
 * @state
 * States necesarias en los slices.
 * */
export interface ModifyLoanState {
  selectedLoan?: Prestamo;
  status: StatusType;
}

export interface LoanState {
  activeLoans: Prestamo[];
  selectedLoanIndex: number;
  selectedLoanIsDisabled: boolean;
  status: StatusType;
}

export interface CreateLoanState {
  isLoading: boolean;
  error: boolean;
}

export interface ReturnLoanState {
  devicesSelected: Tag[];
  status: StatusType;
}

/*
 * @misc
 * Interfaces varias usadas en la carpeta loan.
 * */
export interface ModifyData {
  isNew?: boolean;
  operation?: "suma" | "resta" | "idle";
  difference: number;
  deviceID: string;
  nombre: string;
}

export interface DataToSend {
  loanID: string;
  changedDevices: ModifyData[];
  deletedDevices: (ModifyData | undefined)[] | undefined;
  aula?: string;
}

export interface ReturnLoanData {
  loanID: string;
  returnedDevices: Tag[];
}
