import { Provider } from "react-redux";
import { store } from "@store/store";
import type { AppProps } from "next/app";
import { esES } from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "@styles/reset.css";
import "@styles/globals.css";
import "@styles/alertdialog.css";

const theme = createTheme(
  {
    palette: {
      primary: { main: "#2196f3" },
    },
  },
  esES,
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
