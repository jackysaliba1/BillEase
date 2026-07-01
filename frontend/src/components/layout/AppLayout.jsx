import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#0f28b2" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
          backgroundColor: "#a7c6e3",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}