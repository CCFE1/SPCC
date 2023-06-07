import type { EnhancedTableToolbarProps } from "@models/interfaces";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

// Toolbar del componente tabla
export default function ToolbarComponent(props: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        boxShadow:
          "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {props.title}
      </Typography>
    </Toolbar>
  );
}
