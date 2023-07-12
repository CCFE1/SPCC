import { Dayjs } from "dayjs";
import type { CSSProperties } from "react";
import type { Tag } from "@models/interfaces";
import type { ActionMeta } from "react-select";
import type {
  MouseElementFunction,
  onChangeFunction,
  StatusType,
  Anchor,
  Order,
} from "../types";

/**
 * @ui
 * Estas son interfaces que pertenecen a
 * el folder @ui
 * */
export interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: any;
  onClick?: MouseElementFunction;
}

export interface InputProps {
  name: string;
  styles?: any;
  disabled?: boolean;
  placeholder?: string;
  select?: boolean;
  autocomplete?: "on" | "off";
  isLoading?: boolean;
  value?: string;
  type?: string;
  onClick?: MouseElementFunction;
  ref?: any;
  maxlength?: number;
}

export interface LabelProps {
  text: string;
  size?: string;
  className?: string;
  styles?: CSSProperties;
  other?: any;
}

export interface ListInputProps {
  name: string;
  size?: number;
  styles?: any;
  disabled?: boolean;
  placeholder?: string;
  optionList?: any[];
  select?: boolean;
  autocomplete?: "on" | "off";
  isLoading?: boolean;
  initialValue?: any;
  disableCreate?: boolean;
  disableClearable?: boolean;
  onChange?: (selectedItem: any, actionMeta: ActionMeta<any>) => void;
}

export interface FormListGroupProps {
  label?: LabelProps;
  listInput: ListInputProps;
  styles?: any;
}

export interface LabelTooltipProps {
  styles?: any;
  visibleWords: number;
  text: string;
}

export interface LabelDatePickerProps {
  date: Date;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  excludeWeekends?: boolean;
  onChangeCustom?: (date: Date) => void;
}

export interface DropdownButtonProps {
  text: string;
  listItems: string[];
  downlistItems?: string[];
}

export interface InputLoadingProps {
  width?: string;
  height: string;
  background?: string;
}

export interface InputMuiProps {
  name: string;
  styles?: any;
  disabled?: boolean;
  label: string;
  autocomplete?: "on" | "off";
  isLoading?: boolean;
  type?: string;
  margin?: "none" | "dense" | "normal";
}

export interface LoadingTableBodyProps {
  columnsNumber: number;
  rowsNumber: number;
}

export interface MultiSelectorProps {
  isLoading?: boolean;
  options: any[];
  name: string;
  placeholder: string;
  onChange: onChangeFunction;
  values: any[];
  isDisabled?: boolean;
}

export interface TableMessageProps {
  msg: string;
}

export interface TimePickerModalProps {
  open: boolean;
  ampm: boolean;
  handleClose: () => void;
  minTime?: Dayjs;
  maxTime?: Dayjs;
  shouldDisableTime?: (value: Dayjs, unit: string) => boolean;
  onAccept: (value: Dayjs | null) => void;
}

export interface DateSelectorProps {
  disabled: boolean;
  setValue: any;
}

export interface DnDCardProps {
  setValue: any;
  setStatus: any;
  status: StatusType;
  onClick?: (e: any) => void;
}

export interface CheckboxListProps {
  itemList: Tag[];
  callback: (arg?: any) => void;
}

export interface DrawerOption {
  label: string;
  link: string;
  icon: string;
  action?: () => void;
}

export interface DrawerListProps {
  anchor: Anchor;
  toggleDrawer: any;
  topList: DrawerOption[];
  bottomList?: DrawerOption[];
}

//////////////////////////////
// Table Interfaces
/////////////////////////////
export interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
  disableSort: boolean;
}

export interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, newOrderBy: any) => void;
  styles?: any;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[];
}

export interface EnhancedTableToolbarProps {
  title: string;
}

export interface TableMuiProps {
  rows: any;
  headCells: HeadCell[];
  getCustomRow: (row: any, index: number) => JSX.Element;
}
