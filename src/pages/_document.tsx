import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link href="/assets/Roboto-Regular.ttf" type="font/ttf" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
