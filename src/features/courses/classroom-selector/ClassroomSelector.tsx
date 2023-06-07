import { useEffect, useMemo } from "react";
import { FormListGroup } from "@ui/index";
import { ActionMeta } from "react-select";

import { setControl } from "@devices/deviceSlice";
import type { SelectorProps } from "@models/interfaces";
import { useAppSelector, useAppDispatch } from "@store/hooks";

import { fetchClassrooms, selectClassrooms } from "../courseSlice";

export default function ClassroomSelector(props: SelectorProps) {
  const dispatch = useAppDispatch();
  const classrooms = useAppSelector(selectClassrooms);

  // En caso de haber un valor inicial, se crea una función
  // estática para enviar el valor en su respectivo objeto.
  const { initialValue } = props;
  const defaultValue: any = useMemo(() => {
    return !initialValue
      ? undefined
      : {
          label: initialValue.materia.horario.aula,
          value: initialValue.materia.horario.aula,
        };
  }, [initialValue]);

  const { isLoading, disabled } = props;
  useEffect(() => {
    if (!isLoading && !disabled) {
      dispatch(fetchClassrooms());
    }
  }, [dispatch, isLoading]);

  const onChange = (selectedItem: any, actionMeta: ActionMeta<any>) => {
    if (actionMeta.action === "clear") {
      props.setValue("aulas", "");
      return;
    }

    props.setValue("aulas", selectedItem);
    dispatch(setControl(selectedItem.value));
  };

  return (
    <FormListGroup
      label={{
        text: "Aula",
        styles: {
          marginBottom: ".5rem",
        },
      }}
      listInput={{
        isLoading: isLoading,
        name: "aulas",
        placeholder: "Aula",
        size: 20,
        optionList: classrooms,
        styles: {
          marginLeft: ".5rem",
        },
        select: true,
        onChange,
        initialValue: defaultValue,
        disabled,
        disableClearable: true,
      }}
    />
  );
}
