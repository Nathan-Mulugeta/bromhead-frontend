import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { createTheme } from "@mui/material/styles";

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
  typography: {
    fontFamily: "Manrope, sans-serif",
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        sizeMedium: {
          color: "#fff",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color: "#fff",
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: "#124056",
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        switchViewIcon: {
          color: "#fff",
        },
      },
    },
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#124056",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: "#124056",
        },
      },
    },
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
      dark: "#0F2332",
      light: "#124056",
    },
    text: {
      primary: "#fff",
      secondary: "#B2B2B2",
      dark: "#6F767E",
      darkLight: "#B2B2B2",
    },
  },
});

export default theme;
