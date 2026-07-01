import {
  Box, List, ListItemButton, ListItemIcon,
  ListItemText, Typography, Avatar, Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const NAV_MAIN = [
  { label: "Dashboard", path: "/app",          icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: "Bills",     path: "/app/bills",      icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
  { label: "Reminders", path: "/app/reminders",  icon: <NotificationsOutlinedIcon fontSize="small" /> },
];

const NAV_TOOLS = [
  { label: "Scan bill", path: "/app/scan",       icon: <DocumentScannerOutlinedIcon fontSize="small" /> },
  { label: "Analytics", path: "/app/analytics",  icon: <BarChartOutlinedIcon fontSize="small" /> },
  { label: "Settings",  path: "/app/settings",   icon: <SettingsOutlinedIcon fontSize="small" /> },
];

function NavItem({ label, path, icon, active, onClick }) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        backgroundColor: active ? "rgba(249, 249, 253, 0.94)" : "transparent",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.14)" },
        py: 1,
      }}
    >
      <ListItemIcon sx={{ minWidth: 34, color: active ? "#ffffff" : "#dbeafe" }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          color: active ? "#ffffff" : "#e2e8f0",
        }}
      />
    </ListItemButton>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <Box sx={{
      width: 235,
      flexShrink: 0,
      background: "#0f2f79",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ReceiptLongIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
              BillEase
            </Typography>
            <Typography sx={{ color: "#a5b4c8", fontSize: 10 }}>
              Utility Manager
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav */}
      <List dense sx={{ flex: 1, px: 1.5, pt: 2 }}>
        <Typography sx={{
          color: "#0a3f85",
          fontSize: 10, fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          px: 1, mb: 1,
        }}>
          Main
        </Typography>
        {NAV_MAIN.map(({ label, path, icon }) => (
          <NavItem
            key={path}
            label={label} path={path} icon={icon}
            active={pathname === path}
            onClick={() => navigate(path)}
          />
        ))}

        <Typography sx={{
          color: "#114a98",
          fontSize: 10, fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          px: 1, mt: 2.5, mb: 1,
        }}>
          Tools
        </Typography>
        {NAV_TOOLS.map(({ label, path, icon }) => (
          <NavItem
            key={path}
            label={label} path={path} icon={icon}
            active={pathname === path}
            onClick={() => navigate(path)}
          />
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.96)", mx: 1.5 }} />

      {/* User + logout */}
      <Box sx={{ px: 1.5, py: 1.5 }}>
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1.2,
          px: 1, py: 1, mb: 0.5,
        }}>
          <Avatar sx={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            fontSize: 12, fontWeight: 700, color: "#fff",
          }}>
            {initials}
          </Avatar>
          <Box sx={{ overflow: "hidden", flex: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9" }} noWrap>
              {user?.name}
            </Typography>
            <Typography sx={{ fontSize: 10, color: "#94a3b8" }} noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2, px: 1.5,
            "&:hover": { backgroundColor: "rgba(239,68,68,0.12)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: "#94a3b8" }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            primaryTypographyProps={{
             fontSize: 13, color: "#ffffff" 
              }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}