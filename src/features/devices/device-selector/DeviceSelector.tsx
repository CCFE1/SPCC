import { useEffect } from "react";
import { MultiSelector } from "@ui/index";
import { MultiValue, ActionMeta } from "react-select";
import { openDialog } from "@utils/index";
import type { Item } from "@models/interfaces";
import { useAppSelector, useAppDispatch } from "@store/hooks";

import {
  fetchDevices,
  selectDevices,
  updateSelected,
  updateDeviceAmount,
  selectSelectedDevices,
  removeSelected,
  selectStatus,
} from "@devices/deviceSlice";
import { selectSelectedLoanIndex } from "@loan/active-loans-list/activeLoansListSlice";

export default function DeviceSelector({ isLoading }: { isLoading?: any }) {
  const dispatch = useAppDispatch();
  const values = useAppSelector(selectSelectedDevices);
  const devices = useAppSelector(selectDevices);
  const areDevicesLoading = useAppSelector(selectStatus);

  const selectedLoanIndex = useAppSelector(selectSelectedLoanIndex);
  useEffect(() => {
    if (!isLoading) {
      dispatch(fetchDevices());
    }
  }, [dispatch, isLoading]);

  const selectOption = (itemSelected: Item) => {
    dispatch(updateDeviceAmount(itemSelected));
    dispatch(updateSelected(itemSelected));
  };

  const removeValue = (itemSelected: MultiValue<Item>) => {
    if (!itemSelected) return;
    dispatch(removeSelected(itemSelected as Item[]));
  };

  const onChange = (
    itemsSelected: MultiValue<Item>,
    { action }: ActionMeta<any>,
  ) => {
    const actions: any = {
      "select-option": () =>
        selectOption(itemsSelected[itemsSelected.length - 1]),
      "remove-value": () => removeValue(itemsSelected),
      "pop-value": () => removeValue(itemsSelected),
    };

    try {
      actions[action]();
    } catch (e: any) {
      openDialog(
        "Lo sentimos",
        "Esta acción no está permitida por el momento.",
      );
    }
  };

  return (
    <MultiSelector
      options={devices}
      name="dispositivos"
      placeholder="Dispositivos"
      onChange={onChange}
      values={values}
      isLoading={isLoading}
      isDisabled={areDevicesLoading === "loading"}
    />
  );
}
