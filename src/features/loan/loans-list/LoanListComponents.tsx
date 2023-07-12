import { LabelTooltip } from "@ui/index";
import { TableCell, TableRow } from "@mui/material";
import { getDate, getHourFormated, decodeToken } from "@utils/index";
import DevicesDropdown from "@devices/devices-dropdown/DevicesDropdown";

// Es una row persoalizada para usar la tabla de mui con la estructura del préstamo
export const getCustomRow: (row: any, index: number) => JSX.Element = (
  row: any,
  index: number,
) => {
  const labelId = `enhanced-table-checkbox-${index}`;
  const actualDate = new Date(row.creacion);
  const horaCreacion = getHourFormated(actualDate);
  const fechaCreacion = getDate(actualDate);
  const padding = ".6rem .3rem";
  const { rol } = decodeToken();

  return (
    <TableRow
      hover
      role="row"
      tabIndex={-1}
      key={`${index}-${row.nrc}`}
      sx={{ cursor: "pointer" }}
    >
      <TableCell
        component="th"
        id={labelId}
        scope="row"
        padding="none"
        sx={{ padding }}
      >
        {row.fecha}
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        {row.nrc}
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        <LabelTooltip
          visibleWords={13}
          text={row.nombre}
          styles={{ fontSize: "0.875rem" }}
        />
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        <LabelTooltip
          visibleWords={13}
          text={row.materia}
          styles={{ fontSize: "0.875rem" }}
        />
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        {row.aula}
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        {row.inicio}
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        {row.fin}
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        <DevicesDropdown
          devicesList={row.dispositivos}
          returnedDevices={row.dispositivosDevueltos}
        />
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        {row.status}
      </TableCell>
      {/* Esta es la fecha de creación del préstamo verdadera. Solo el admin puede verla */}
      {rol === "admin" && (
        <TableCell align="left" padding="none" sx={{ padding }}>
          {`${horaCreacion} ${fechaCreacion}`}
        </TableCell>
      )}
      <TableCell align="left" padding="none" sx={{ padding }}>
        {row.creador}
      </TableCell>
      <TableCell align="left" padding="none" sx={{ padding }}>
        <LabelTooltip
          visibleWords={13}
          text={row.observaciones}
          styles={{ fontSize: "0.875rem" }}
        />
      </TableCell>
    </TableRow>
  );
};
