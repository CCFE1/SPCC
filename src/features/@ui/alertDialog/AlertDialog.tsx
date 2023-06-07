import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AlertDialog = withReactContent(
  Swal.mixin({
    customClass: {
      htmlContainer: "scrollbar",
    },
  })
);

export default AlertDialog;
