import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  "Smart reminders before due dates",
  "OCR bill scanning — auto-fill forms",
  "Analytics dashboard & monthly reports",
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f7ff 0%, #faf5ff 50%, #f0fdf4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", p: 2,
    }}>
      <Box sx={{ display: "flex", gap: 6, alignItems: "center", width: "100%", maxWidth: 860 }}>

        {/* Left side */}
        <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box sx={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ReceiptLongIcon sx={{ color: "#fff", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1e1b4b" }}>BillEase</Typography>
              <Typography sx={{ fontSize: 11, color: "#6366f1" }}>Smart Bill Manager</Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#1e1b4b", lineHeight: 1.3, mb: 1.5 }}>
            Manage your bills,<br />
            <Box component="span" sx={{ color: "#6366f1" }}>stress-free</Box>
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#6b7280", mb: 3, lineHeight: 1.7 }}>
            Never miss a payment again. BillEase keeps all your utility bills organized in one place.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {FEATURES.map((f) => (
              <Box key={f} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{
                  width: 28, height: 28, background: "#f5f3ff",
                  borderRadius: 1.5,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "#6366f1" }} />
                </Box>
                <Typography sx={{ fontSize: 13, color: "#374151" }}>{f}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right side — form */}
        <Box sx={{
          width: "100%", maxWidth: 400,
          background: "#fff",
          borderRadius: 4,
          border: "1px solid rgba(99,102,241,0.15)",
          p: 4,
          boxShadow: "0 8px 32px rgba(99,102,241,0.08)",
        }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 3, justifyContent: "center" }}>
            <Box sx={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ReceiptLongIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b" }}>BillEase</Typography>
          </Box>

          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Box sx={{
              width: 52, height: 52,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 3,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              mb: 1.5,
            }}>
              <ReceiptLongIcon sx={{ color: "#fff", fontSize: 26 }} />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#1e1b4b" }}>Welcome back</Typography>
            <Typography sx={{ fontSize: 13, color: "#9ca3af", mt: 0.5 }}>Sign in to your account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email address" name="email" type="email"
              value={form.email} onChange={handleChange}
              required fullWidth autoFocus
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#f9fafb" } }}
            />
            <TextField
              label="Password" name="password"
              type={showPass ? "text" : "password"}
              value={form.password} onChange={handleChange}
              required fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#f9fafb" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass((p) => !p)} edge="end">
                      {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit" variant="contained" size="large"
              disabled={loading} sx={{ mt: 1, py: 1.4, borderRadius: 2, fontSize: 14 }}
            >
              {loading ? "Signing in…" : "Sign in to BillEase"}
            </Button>
          </Box>

          <Typography sx={{ fontSize: 13, color: "#9ca3af", textAlign: "center", mt: 3 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
              Create one free
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}