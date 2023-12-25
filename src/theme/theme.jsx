import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { createTheme } from "@mui/material/styles";

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
  palette: {
    primary: {
      light: "#FFAC1E",
      main: "#FFAC1E",
      dark: "#E16116",
      contrastText: "#fff",
    },
    secondary: {
      light: "#E16116",
      main: "#E16116",
      dark: "#FFAC1E",
      contrastText: "#fff",
    },
    background: {
      light: "#124056",
    },
    text: {
      primary: "#fff",
      secondary: "#B2B2B2",
    },
  },
});

export default theme;
