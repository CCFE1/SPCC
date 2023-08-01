import { Snackbar, SnackbarContent } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import {
  selectIsSnackbarOpen,
  selectMessage,
  setIsSnackbarOpen,
} from "./snackbarNotificationSlice";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsSnackbarOpen);
  const message = useAppSelector(selectMessage);

  const handleClose = () => {
    dispatch(setIsSnackbarOpen(false));
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={2000}
      open={isOpen}
      onClose={handleClose}
      message={message}
      key={"top-center-snackbar"}
    />
  );
}
