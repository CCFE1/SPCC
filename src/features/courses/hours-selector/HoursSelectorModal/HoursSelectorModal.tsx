import { Dayjs } from "dayjs";
import { TimePickerModal } from "@ui/index";
import { getDayjsFormatByHour } from "@utils/index";

export default function HoursSelectorModal(props: HoursSelectorModalProps) {
  const onAccept = (value: Dayjs | null) => {
    // Si value no es null
    if (!!value) {
      const { setValue, inputName } = props;
      const hourSelected: number = value.hour();
      props.handleClose();

      setValue(inputName, {
        label: `${hourSelected}:00`,
        value: hourSelected,
      });
    }
  };

  return (
    <TimePickerModal
      ampm={false}
      open={props.open}
      handleClose={props.handleClose}
      minTime={getDayjsFormatByHour(7)}
      maxTime={getDayjsFormatByHour(21)}
      onAccept={onAccept}
      shouldDisableTime={(value, unit) => {
        // Deshabilita los minutos.
        return unit === "minutes" && value.minute() > 0;
      }}
    />
  );
}

interface HoursSelectorModalProps {
  open: boolean;
  handleClose: () => void;
  setValue: any;
  inputName: "horaInicio" | "horaFin";
}
