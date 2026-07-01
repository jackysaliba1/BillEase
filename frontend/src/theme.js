import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
      light: "#f5f3ff",
      dark: "#4338ca",
    },
    success: { main: "#059669", light: "#d1fae5" },
    warning: { main: "#d97706", light: "#fef3c7" },
    error:   { main: "#dc2626", light: "#fee2e2" },
    background: { default: "#f8f9ff", paper: "#ffffff" },
    text: { primary: "#929198", secondary: "#454647" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500, boxShadow: "none" },
        containedPrimary: {
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          "&:hover": { boxShadow: "none", background: "linear-gradient(135deg, #4f46e5, #7c3aed)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #ede5fc",
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { boxShadow: "none" } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            background: "#f5f3ff",
            color: "#6366f1",
            fontWeight: 600,
            fontSize: 12,
          },
        },
      },
    },
  },
});

export default theme;