import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
    palette: {
        primary: {
            main: "#997db5",
        },
        secondary: {
            main: "#e6dbf1",
        },
        error: {
            main: red.A400,
        },
    },
});

export default theme;
