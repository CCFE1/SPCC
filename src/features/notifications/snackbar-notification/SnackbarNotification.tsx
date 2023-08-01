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
      autoHideDuration={1750}
      open={isOpen}
      onClose={handleClose}
      key={"top-center-snackbar"}
    >
      <SnackbarContent
        className="f-center"
        style={{
          backgroundColor: "#fff",
          color: "#000",
        }}
        message={<span id="client-snackbar">{message}</span>}
      />
    </Snackbar>
  );
}
