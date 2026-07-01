import { useNavigate } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const CONTACT_INFO = [
  {
    icon: <PersonOutlinedIcon />,
    iconBg: "#f5f3ff", iconColor: "#6366f1",
    label: "Developer",
    value: "Jacqueline Saliba",
    sub: "Full-stack developer · BillEase graduation project",
  },
  {
    icon: <EmailOutlinedIcon />,
    iconBg: "#d1fae5", iconColor: "#059669",
    label: "Email",
    value: "jackysalwehbe@gmail.com",
    sub: "We typically respond within 24 hours",
  },
  {
    icon: <SchoolOutlinedIcon />,
    iconBg: "#fef3c7", iconColor: "#d97706",
    label: "University",
    value: "Arab Open University(AOU)",
    sub: "Computer Science Department · 2026",
  },
  {
    icon: <GitHubIcon />,
    iconBg: "#e0f2fe", iconColor: "#0284c7",
    label: "GitHub",
    value: "github.com/jackysaliba1",
    sub: "Source code and documentation",
  },
  {
    icon: <LocationOnOutlinedIcon />,
    iconBg: "#ede9fe", iconColor: "#7c3aed",
    label: "Location",
    value: "Bteghrine,Mount-Lebanon",
    sub: "Available for remote collaboration",
  },
];

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ background: "#f8f9ff", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <Box sx={{
        background: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid rgba(99,102,241,0.12)",
        px: { xs: 3, md: 6 }, py: 1.8,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <Box
          onClick={() => navigate("/")}
          sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer" }}
        >
          <Box sx={{
            width: 34, height: 34, background: "#6366f1",
            borderRadius: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ReceiptLongIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#1e1b4b" }}>
            BillEase
          </Typography>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3.5 }}>
          {[
            { label: "Home",         path: "/" },
            { label: "How it works", path: "/" },
            { label: "Contact",      path: "/contact" },
          ].map((l) => (
            <Typography
              key={l.label}
              onClick={() => navigate(l.path)}
              sx={{
                fontSize: 14,
                color: l.label === "Contact" ? "#6366f1" : "#6b7280",
                fontWeight: l.label === "Contact" ? 600 : 400,
                cursor: "pointer",
                "&:hover": { color: "#6366f1" },
              }}
            >
              {l.label}
            </Typography>
          ))}
        </Box>

        <Box
          onClick={() => navigate("/register")}
          sx={{
            background: "#6366f1", color: "#fff",
            borderRadius: "20px", px: 2.5, py: 0.9,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          Get started
        </Box>
      </Box>

      {/* ── Contact content ── */}
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>

        {/* Header */}
        <Box sx={{ width: 56, height: 3, background: "#6366f1", borderRadius: 1, mx: "auto", mb: 1.5 }} />
        <Typography sx={{ fontSize: 32, fontWeight: 700, color: "#1e1b4b", textAlign: "center", mb: 1 }}>
          Contact us
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#9ca3af", textAlign: "center", mb: 5 }}>
          Have questions? Here's how to reach us
        </Typography>

        {/* Info card */}
        <Box sx={{
          background: "#fff",
          border: "1px solid #ede9fe",
          borderRadius: 4,
          p: { xs: 3, md: 4 },
        }}>
          {CONTACT_INFO.map((item, i) => (
            <Box
              key={item.label}
              sx={{
                display: "flex", alignItems: "center", gap: 2,
                py: 2,
                borderBottom: i < CONTACT_INFO.length - 1
                  ? "1px solid #f5f3ff" : "none",
              }}
            >
              {/* Icon */}
              <Box sx={{
                width: 44, height: 44, borderRadius: 2,
                background: item.iconBg, color: item.iconColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {item.icon}
              </Box>

              {/* Text */}
              <Box>
                <Typography sx={{
                  fontSize: 11, color: "#9ca3af",
                  fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: "0.06em", mb: 0.4,
                }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b" }}>
                  {item.value}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#6b7280", mt: 0.3 }}>
                  {item.sub}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

      </Container>

      {/* ── Footer ── */}
      <Box sx={{
        background: "#1e1b4b",
        px: { xs: 3, md: 6 }, py: 3,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 2,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box sx={{
            width: 28, height: 28, background: "#6366f1",
            borderRadius: 1.5,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ReceiptLongIcon sx={{ color: "#fff", fontSize: 15 }} />
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>BillEase</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          {["Home", "How it works", "Contact"].map((l) => (
            <Typography
              key={l}
              onClick={() => navigate(l === "Contact" ? "/contact" : "/")}
              sx={{ fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer", "&:hover": { color: "#fff" } }}
            >
              {l}
            </Typography>
          ))}
        </Box>
        <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          © 2026 BillEase. All rights reserved.
        </Typography>
      </Box>

    </Box>
  );
}