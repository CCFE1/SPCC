import { Dispositivo, MetaDispositivo } from "@models/interfaces";

export interface Item extends Dispositivo {
  value: string;
  isDisabled: boolean;
  label: string;
  labelPrestado: string;
}

export interface DevicesDropdownProps {
  devicesList: MetaDispositivo[];
  returnedDevices?: MetaDispositivo[];
}

export interface DevicesState {
  selectedDevices: Item[];
  devices: Item[];
  status: "idle" | "loading" | "failed";
}
