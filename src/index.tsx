// index.tsx
import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom/client";
// fonts
import "@fontsource/plus-jakarta-sans/latin.css";

import { SwapProvider, useSwap } from "lib/context/SwapKit";
import { theme } from "lib/styles/theme";

import App from "./App";

//begin dev mode
// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );
// root.render(
//   <>
//     <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
//     <App />
//   </>
// );
//end dev mode

//publish as lib
export { SwapProvider, useSwap };
