import type {
  Prestamo,
  MetaDispositivo,
  Item,
  ModifyData,
} from "@models/interfaces";

// Función utilizada en el hook para agregar los datos a los inputs
export const getDevicesToSelect = (
  devices: Item[],
  selectedLoan: Prestamo | undefined
): (Item | undefined)[] => {
  // Obtiene los dispositivos a seleccionar de la lista de dispositivos
  const devicesToSelect: (Item | undefined)[] = devices
    .map((device: Item) => {
      const match: MetaDispositivo | undefined =
        selectedLoan?.dispositivos.reduce(
          (acc: any, activeDevice: MetaDispositivo) => {
            if (activeDevice._id === device._id) {
              acc = activeDevice;
            }
            return acc;
          },
          undefined
        );

      return match
        ? {
            ...device,
            localPrestado: match.localPrestado,
          }
        : undefined;
    })
    .filter((item: any) => !!item);

  return devicesToSelect;
};

// Obtener data para enviar
export const getDataToSend = (
  selectedDevices: Item[],
  selectedLoan: Prestamo | undefined
): ModifyData[] => {
  const dataToSend: ModifyData[] = selectedDevices.map((newDevice: Item) => {
    // La información por defecto es la de un dispositivo nuevo agregado
    let isNew: boolean = true;
    let operation: "suma" | "resta" | "idle" = "suma";
    let difference: number = newDevice.localPrestado;

    // Busqueda de dispositivo de deviceSelector en los dispositivos originales
    const originalDevice: MetaDispositivo | undefined =
      selectedLoan?.dispositivos.filter((loanDevice: MetaDispositivo) => {
        return loanDevice._id === newDevice._id;
      })[0];

    // Si el dispositivo ya estaba en la lista de dispositivos original.
    if (!!originalDevice) {
      isNew = false;
      difference = newDevice.localPrestado - originalDevice.localPrestado;
      operation = !difference ? "idle" : difference < 0 ? "resta" : "suma";
    }

    return {
      isNew,
      operation,
      difference,
      deviceID: newDevice._id,
      nombre: newDevice.nombre,
    };
  });

  return dataToSend;
};

export const getDeletedDevices = (
  selectedDevices: Item[],
  selectedLoan: Prestamo | undefined
): (ModifyData | undefined)[] | undefined => {
  const deletedDevices: (ModifyData | undefined)[] | undefined =
    selectedLoan?.dispositivos
      .map((loanDevice: MetaDispositivo) => {
        const isThere: boolean = !!selectedDevices.filter(
          (newDevice: Item) => newDevice._id === loanDevice._id
        )[0];
        return isThere
          ? undefined
          : {
              deviceID: loanDevice._id,
              nombre: loanDevice.nombre,
              difference: loanDevice.localPrestado,
            };
      })
      .filter((item: any) => !!item);

  return deletedDevices;
};
