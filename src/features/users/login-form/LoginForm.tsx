import axios from "axios";
import { useState } from "react";
import { Form } from "react-final-form";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

import { openDialog } from "@utils/index";
import { useAppDispatch } from "@store/hooks";
import { InputMui, Label } from "@ui/index";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Function to get values when submit form
  const onSubmit = (values: any) => {
    if (!values.nickname || !values.password) {
      openDialog("Mensaje", "No deje campos vacios");
      return;
    }

    setIsLoading(true);
    axios
      .post(`/api/v1/login`, {
        nickname: values.nickname,
        pass: values.password,
      })
      .then((response: any) => {
        setIsLoading(false);
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          router.replace("/main");
        }
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.log(error);
        if (error.code === "ERR_NETWORK") {
          openDialog("Mensaje", "Error al conectar con servidor");
          return;
        }

        if (error.response.status === 401) {
          openDialog("Mensaje", "Usuario y/o contraseña incorrectos");
          return;
        }

        if (error.response.status === 500) {
          openDialog("Mensaje", "Error al conectar con servidor");
          return;
        }

        openDialog("Mensaje", "Error al conectar con servidor");
      });
  };

  return (
    <div className={styles.loginForm}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: ".9rem",
              }}
            >
              <Label text="Login" size="28px" />
            </div>

            <InputMui label="Usuario" name="nickname" />
            <InputMui label="Contraseña" type="password" name="password" />

            <div style={{ marginTop: ".5rem" }}>
              <Button type="submit" disabled={isLoading} variant="contained">
                Login
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  );
}
