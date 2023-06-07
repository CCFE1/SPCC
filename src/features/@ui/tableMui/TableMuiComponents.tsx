import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

import type {
  EnhancedTableProps,
  HeadCell,
} from "@models/interfaces";

// Aqui van los nombres de las columnas en la tabla mui
export function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    order,
    orderBy,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (newOrderBy: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, newOrderBy);
    };

  return (
    <TableHead>
      <TableRow>
        {props.headCells.map((headCell: HeadCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={props.styles}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              hideSortIcon={headCell.disableSort}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={!headCell.disableSort ? createSortHandler(headCell.id): undefined}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
