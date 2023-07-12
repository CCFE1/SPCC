import { DropdownButton } from "@ui/index";
import { MetaDispositivo, DevicesDropdownProps } from "@models/interfaces";

// Botón para desplegar la lista de dispositivos
// prestados en la lista de prestamos activos
export default function DevicesDropdown(props: DevicesDropdownProps) {
  const listItems: string[] = props.devicesList.map(
    (dispositivo: MetaDispositivo) =>
      `${dispositivo.nombre} (${dispositivo.localPrestado})`,
  );

  const downlistItems: string[] | undefined = !props.returnedDevices
    ? undefined
    : props.returnedDevices.map(
        (device: MetaDispositivo) =>
          `${device.nombre} (${device.localPrestado})`,
      );

  return (
    <DropdownButton
      text="Dispositivos"
      listItems={listItems}
      downlistItems={downlistItems}
    />
  );
}
