import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const HOW_STEPS = [
  { num: "1", title: "Create account",  desc: "Sign up in seconds with your name, email and password" },
  { num: "2", title: "Add your bills",  desc: "Add bills manually or scan them with our OCR camera feature" },
  { num: "3", title: "Set reminders",   desc: "Choose when and how to be notified before each due date" },
  { num: "4", title: "Stay on track",   desc: "Mark bills as paid and track spending with analytics" },
];

const STATS = [
  { val: "10K+",  label: "Bills managed" },
  { val: "98%",   label: "On-time payments" },
  { val: "5 min", label: "Setup time" },
];

export default function LandingPage() {
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
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box sx={{
            width: 34, height: 34,
            background: "#6366f1",
            borderRadius: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ReceiptLongIcon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#1e1b4b" }}>
            BillEase
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3.5 }}>
          {["Home", "How it works", "Contact"].map((l) => (
            <Typography
              key={l}
              onClick={() => {
                if (l === "Contact") navigate("/contact");
              }}
              sx={{
                fontSize: 14, color: "#6b7280", cursor: "pointer",
                "&:hover": { color: "#6366f1" },
                transition: "color 0.2s",
              }}
            >
              {l}
            </Typography>
          ))}
        </Box>

        {/* CTA */}
        <Button
          onClick={() => navigate("/register")}
          sx={{
            background: "#6366f1", color: "#fff",
            borderRadius: "20px", px: 2.5, py: 0.9,
            fontSize: 13, fontWeight: 600,
            textTransform: "none",
            "&:hover": { background: "#4f46e5" },
          }}
        >
          Get started
        </Button>
      </Box>

      {/* ── Hero ── */}
      <Box sx={{
        minHeight: 540,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        px: 3, py: 10,
        position: "relative", overflow: "hidden",
      }}>
        {/* Background circles */}
        {[
          { size: 500, top: -150, right: -120, left: "auto", bottom: "auto" },
          { size: 350, bottom: -100, left: -80,  top: "auto",  right: "auto" },
          { size: 220, top: 80,    left: 100,   right: "auto", bottom: "auto" },
        ].map((c, i) => (
          <Box key={i} sx={{
            position: "absolute",
            width: c.size, height: c.size,
            borderRadius: "50%",
            background: i === 1 ? "#8b5cf6" : "#6366f1",
            opacity: 0.06,
            top: c.top, right: c.right,
            bottom: c.bottom, left: c.left,
          }} />
        ))}

        {/* Badge */}
        <Box sx={{
          display: "inline-flex", alignItems: "center", gap: 0.8,
          background: "#f5f3ff", border: "1px solid #ede9fe",
          borderRadius: "20px", px: 2, py: 0.6, mb: 2.5,
          position: "relative", zIndex: 1,
        }}>
          <Typography sx={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>
            ✦ Smart bill management
          </Typography>
        </Box>

        {/* Title */}
        <Typography sx={{
          fontSize: { xs: 36, md: 52 },
          fontWeight: 700, color: "#1e1b4b",
          lineHeight: 1.15, mb: 2.5,
          position: "relative", zIndex: 1,
        }}>
          Stop forgetting<br />
          your bills.<br />
          <Box component="span" sx={{ color: "#6366f1" }}>
            Start managing them.
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography sx={{
          fontSize: 16, color: "#6b7280",
          lineHeight: 1.75, mb: 4.5,
          maxWidth: 400,
          position: "relative", zIndex: 1,
        }}>
          One place for all your utility bills. Get reminders, scan receipts,
          and always stay on top of your payments.
        </Typography>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/register")}
          variant="contained"
          size="large"
          startIcon={<RocketLaunchIcon />}
          sx={{
            background: "#6366f1",
            borderRadius: 3, px: 5, py: 1.6,
            fontSize: 16, fontWeight: 700,
            textTransform: "none",
            position: "relative", zIndex: 1,
            "&:hover": { background: "#4f46e5" },
          }}
        >
          Get started
        </Button>

        {/* Stats */}
        <Box sx={{
          display: "flex", gap: 5, mt: 6,
          position: "relative", zIndex: 1,
          alignItems: "center",
        }}>
          {STATS.map((s, i) => (
            <Box key={s.label} sx={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#6366f1" }}>
                  {s.val}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: 0.3 }}>
                  {s.label}
                </Typography>
              </Box>
              {i < STATS.length - 1 && (
                <Box sx={{ width: "1px", height: 40, background: "#ede9fe" }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── How it works ── */}
      <Box sx={{
        background: "#fff",
        borderTop: "1px solid #ede9fe",
        borderBottom: "1px solid #ede9fe",
        py: { xs: 6, md: 9 },
        px: { xs: 3, md: 6 },
      }}>
        {/* Section header */}
        <Box sx={{ width: 56, height: 3, background: "#6366f1", borderRadius: 1, mx: "auto", mb: 1.5 }} />
        <Typography sx={{ fontSize: 30, fontWeight: 700, color: "#1e1b4b", textAlign: "center", mb: 1 }}>
          How it works
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#9ca3af", textAlign: "center", mb: 6 }}>
          Get started in minutes — no setup required
        </Typography>

        <Container maxWidth="md">
          <Grid container spacing={3}>
            {HOW_STEPS.map((s, i) => (
              <Grid item xs={12} sm={6} md={3} key={s.num}>
                <Box sx={{ textAlign: "center", px: 1 }}>
                  <Box sx={{
                    width: 50, height: 50,
                    background: i % 2 === 0
                      ? "#6366f1"
                      : "#f5f3ff",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    mx: "auto", mb: 2,
                  }}>
                    <Typography sx={{
                      fontSize: 18, fontWeight: 700,
                      color: i % 2 === 0 ? "#fff" : "#6366f1",
                    }}>
                      {s.num}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", mb: 0.8 }}>
                    {s.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.65 }}>
                    {s.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

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
              onClick={() => l === "Contact" && navigate("/contact")}
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