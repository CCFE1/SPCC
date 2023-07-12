import axios from "axios";
import { RootState } from "@store/store";

import type { Dispositivo, Item, DevicesState } from "@models/interfaces";
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  current,
} from "@reduxjs/toolkit";

///////////////////////////
// State
///////////////////////////
const initialState: DevicesState = {
  selectedDevices: [],
  devices: [],
  status: "loading",
};

///////////////////////////
// Async functions
///////////////////////////

// Function to get all devices
export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async (arg, { dispatch }) => {
    // Limpiar selected devices para evitar bugs en la lista de dispositivos
    // al momento de refrescarla
    dispatch(setSelectedDevices([]));

    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response: any = await axios.get<any>(`/api/v1/devices`, config);
    const devices: Item[] = response.data.data.map((device: Dispositivo) => {
      return {
        _id: device._id,
        nombre: device.nombre,
        stock: device.stock,
        prestado: device.prestado,
        value: device.nombre,
        isDisabled: !(device.stock - device.prestado) ? true : false,
        localPrestado: 0,
        get label() {
          return `${this.value} (${
            this.stock - this.prestado - this.localPrestado
          })`;
        },
        get labelPrestado() {
          return `${this.value} (${this.localPrestado})`;
        },
      };
    });

    return devices;
  },
);

// Function to set a control
export const setControl = createAsyncThunk(
  "devices/setControl",
  async (aula: string, { dispatch, getState }) => {
    const unk: any = getState();
    const state: any = unk.devices;

    const buscarDispositivo = (
      salon: string,
      controlesSeleccionados: Item[],
    ) => {
      // Buscar dispositivo por el nombre del salón
      const isDeviceSelected = controlesSeleccionados.filter((control: any) => {
        const salonDelControl = control.nombre.split(" ")[1];
        return salonDelControl === salon;
      });

      return !!isDeviceSelected.length;
    };

    // saber si el salón seleccionado tiene un control
    const isThereAControl: Item[] = state.devices.filter((device: Item) => {
      const deviceName = device.nombre.split(" ")[1];
      return deviceName === aula;
    });

    // Si no hay un control.
    if (!isThereAControl.length) return;

    // Si la cantidad total del dispositivo es 0, no agregarlo a la lista
    const { stock, prestado } = isThereAControl[0];
    if (!(stock - prestado)) {
      return;
    }

    // Obtener los controles seleccionados en el device selector
    const controlesSeleccionados: Item[] = state.selectedDevices.filter(
      (device: Item) => {
        const deviceType = device.nombre.split(" ")[0];
        return deviceType.includes("control");
      },
    );

    if (!!controlesSeleccionados.length) {
      // Interrumpir el seteo del control si es que ya existe en la lista de dispositivos
      const isDeviceSelected: boolean = buscarDispositivo(
        aula,
        controlesSeleccionados,
      );
      if (isDeviceSelected) {
        return;
      }

      controlesSeleccionados.reduce(
        (selectedDevices: Item[], control: Item) => {
          const controlRemoved: Item[] = selectedDevices.filter(
            (selectDevice: Item) => {
              return selectDevice._id !== control._id;
            },
          );

          dispatch(removeSelected(controlRemoved));
          dispatch(setSelectedDevices(controlRemoved));

          return controlRemoved;
        },
        [...state.selectedDevices],
      );
    }

    dispatch(updateDeviceAmount(isThereAControl[0]));
    dispatch(updateSelected(isThereAControl[0]));
  },
);

///////////////////////////
// Slice
///////////////////////////
export const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    // Agrega un dispositivo en la lista de seleccionados
    // O aumenta la cantidad del dispositivo seleccionado si es que se encuentra ahí
    updateSelected: (state, action: PayloadAction<Item>) => {
      const [lastItem] = state.devices.filter(
        (device: Item) => device._id === action.payload._id,
      );
      const selectedDevices = state.selectedDevices.map((device: Item) => ({
        ...device,
      }));
      // Verificar si existe el ultimo item en el array value
      const [result] = selectedDevices.filter(
        (device: Item) => device._id === lastItem._id,
      );

      // Si existe el tag, modifica la cantidad, si no, agrega el nuevo item
      const tags = !!result
        ? state.selectedDevices.map((device: Item) => {
            const newLocalPrestado: number = device.localPrestado + 1;
            const nombre: string = device.value;

            return device.value !== lastItem.value
              ? { ...device }
              : {
                  ...device,
                  localPrestado: newLocalPrestado,
                  value: nombre,
                  label: `${nombre} (${newLocalPrestado})`,
                };
          })
        : [
            ...selectedDevices,
            {
              ...lastItem,
              value: lastItem.value,
              label: lastItem.value,
            },
          ];

      const newTags: any = tags.map((device: Item) => ({ ...device }));
      return {
        ...state,
        selectedDevices: newTags,
      };
    },
    // Aumenta la cantidad de préstamo local en la lista de dispositivos global.
    updateDeviceAmount: (state, action: PayloadAction<Item>) => {
      const devices = state.devices.map((device) => {
        const { _id, value, stock, prestado, localPrestado, isDisabled } =
          device;
        const newLocalPrestado: number =
          _id === action.payload._id ? localPrestado + 1 : localPrestado;
        const newIsDisabled =
          stock - prestado - newLocalPrestado === 0 ? true : isDisabled;

        return {
          ...device,
          localPrestado: newLocalPrestado,
          isDisabled: newIsDisabled,
          label: `${value} (${stock - prestado - newLocalPrestado})`,
          labelPrestado: `${value} (${newLocalPrestado})`,
        };
      });

      return {
        ...state,
        devices,
      };
    },
    // Se le envía la lista de préstamos seleccionados, eliminando el dispositivo que
    // no se quiere y actualiza la lista global de dispositivos aumentando la cantidad
    // del dispositivo eliminado en la misma.
    removeSelected: (state, action: PayloadAction<Item[]>) => {
      // Encontrar item eliminado
      const [itemDeleted]: Item[] = state.selectedDevices.filter(
        (value: Item) =>
          !action.payload.some((item: Item) => value.value === item.value),
      );

      console.log("item que se eliminó: ");
      console.log(current(itemDeleted));

      // Actualizar la opción eliminada
      const devicesUpdated = state.devices.map((option: Item) => {
        if (option.value === itemDeleted.value) {
          return {
            ...option,
            localPrestado: 0,
            isDisabled: false,
            prestado: itemDeleted.prestado,
            label: `${option.value} (${option.stock - itemDeleted.prestado})`,
            labelPrestado: `${option.value} (0)`,
          };
        }
        return option;
      });

      return {
        ...state,
        devices: devicesUpdated,
        selectedDevices: action.payload,
      };
    },
    // Elimina los selectedDevices
    clearDevices: (state) => {
      return { ...state, selectedDevices: [] };
    },
    setSelectedDevices: (state, action: PayloadAction<Item[]>) => {
      return { ...state, selectedDevices: action.payload };
    },
    setDevices: (state, action: PayloadAction<Item[]>) => {
      return { ...state, devices: action.payload };
    },
    // Resta la cantidad local del dispositivo seleccionado en la lista global de dispositivos
    setDeviceAmount: (state, { payload }: PayloadAction<Item>) => {
      const devices: Item[] = [...state.devices];
      const updatedDevices: Item[] = devices.map((device: Item) =>
        device._id === payload._id
          ? (({ prestado, value, stock }) => {
              const newPrestado = prestado - payload.localPrestado;
              return {
                ...device,
                prestado: newPrestado,
                label: `${value} (${stock - prestado - payload.localPrestado})`,
                labelPrestado: `${value} (${payload.localPrestado})`,
              };
            })(device)
          : device,
      );

      return {
        ...state,
        devices: updatedDevices,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = "idle";
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default deviceSlice.reducer;
export const {
  updateDeviceAmount,
  setSelectedDevices,
  setDevices,
  updateSelected,
  removeSelected,
  clearDevices,
  setDeviceAmount,
} = deviceSlice.actions;

///////////////////////////
// Selector
///////////////////////////
export const selectSelectedDevices = (state: RootState) =>
  state.devices.selectedDevices;
export const selectDevices = (state: RootState) => state.devices.devices;
export const selectStatus = (state: RootState) => state.devices.status;
