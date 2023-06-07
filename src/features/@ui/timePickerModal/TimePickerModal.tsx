import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import style from "./TimePickerModalStyles";

import { getDayjsFormatByHour } from "@utils/index";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";

import type { TimePickerModalProps } from "@models/interfaces";

export default function TimePickerModal(props: TimePickerModalProps) {
  const [initialTime] = useState(getDayjsFormatByHour());
  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticTimePicker
              ampm={props.ampm}
              defaultValue={initialTime}
              minTime={props.minTime}
              maxTime={props.maxTime}
              shouldDisableTime={props.shouldDisableTime}
              onClose={props.handleClose}
              onAccept={props.onAccept}
            />
          </LocalizationProvider>
        </Box>
      </Modal>
    </div>
  );
}
