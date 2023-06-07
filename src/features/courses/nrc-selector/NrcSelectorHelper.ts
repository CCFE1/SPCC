import { setControl } from "@devices/deviceSlice";
import { getDayName, resetFormInputs } from "@utils/index";
import type { NrcTag, LoanInputName } from "@models/types";

// Limpia los campos nrc, maestro, materia y aula
export const clearAction = (setValue: any) => {
  const toDelete: LoanInputName[] = ["nrcs", "maestros", "materias", "aulas"];
  return resetFormInputs(setValue, toDelete);
};

// Settea el nrc, el maestro y la materia
export const setFirstLoanData = (setValue: any, selectedItem: NrcTag) => {
  // Setteando nrc
  setValue("nrcs", selectedItem);

  // Setteando maestro
  setValue(
    "maestros",
    selectedItem.maestro
      ? {
          ...selectedItem.maestro,
          label: selectedItem.maestro.nombre,
          value: selectedItem.maestro._id,
        }
      : ""
  );

  // Setteando materia
  setValue("materias", {
    ...selectedItem.materia,
    label: selectedItem.materia.nombre,
    value: selectedItem.materia._id,
  });
};

// Settea el control del aula, el aula, hora de inicio y hora de fin.
export const setSecondLoanData = (
  setValue: any,
  selectedItem: NrcTag,
  dispatch: any,
  date: Date
) => {
  const dayName = getDayName(date);
  const horario = selectedItem.horarios.filter(
    (horario: any) => horario.dia === dayName
  );
  if (!horario.length) {
    setValue("aulas", "");
    setValue("horaInicio", "");
    setValue("horaFin", "");
    return;
  }

  dispatch(setControl(horario[0].aula));
  // Setteando aulas
  setValue("aulas", {
    label: horario[0].aula,
    value: horario[0].aula,
  });

  // Setteando hora de inicio
  setValue("horaInicio", {
    label: `${horario[0].horaInicio}:00`,
    value: horario[0].horaInicio,
  });

  // Setteando hora de fin
  setValue("horaFin", {
    label: `${horario[0].horaFin}:00`,
    value: horario[0].horaFin,
  });
};
