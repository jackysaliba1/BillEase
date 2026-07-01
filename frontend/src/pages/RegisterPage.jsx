import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
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
      <Box sx={{
        width: "100%", maxWidth: 420,
        background: "#fff",
        borderRadius: 4,
        border: "1px solid rgba(99,102,241,0.15)",
        p: 4,
        boxShadow: "0 8px 32px rgba(99,102,241,0.08)",
      }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{
            width: 52, height: 52,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 3,
            display: "inline-flex", alignItems: "center", justifyContent: "center", mb: 1.5,
          }}>
            <ReceiptLongIcon sx={{ color: "#fff", fontSize: 26 }} />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#1e1b4b" }}>Create your account</Typography>
          <Typography sx={{ fontSize: 13, color: "#9ca3af", mt: 0.5 }}>Start managing your bills for free</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Full name" name="name"
            value={form.name} onChange={handleChange}
            required fullWidth autoFocus
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#f9fafb" } }}
          />
          <TextField
            label="Email address" name="email" type="email"
            value={form.email} onChange={handleChange}
            required fullWidth
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
          <TextField
            label="Confirm password" name="confirm"
            type={showPass ? "text" : "password"}
            value={form.confirm} onChange={handleChange}
            required fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#f9fafb" } }}
          />

          {/* Security note */}
          <Box sx={{
            background: "#f5f3ff", border: "1px solid #ede9fe",
            borderRadius: 2, p: 1.5,
            display: "flex", alignItems: "center", gap: 1,
          }}>
            <ShieldOutlinedIcon sx={{ fontSize: 18, color: "#6366f1" }} />
            <Typography sx={{ fontSize: 12, color: "#6366f1" }}>Your data is encrypted and secure</Typography>
          </Box>

          <Button
            type="submit" variant="contained" size="large"
            disabled={loading} sx={{ py: 1.4, borderRadius: 2, fontSize: 14 }}
          >
            {loading ? "Creating account…" : "Create my account"}
          </Button>
        </Box>

        <Typography sx={{ fontSize: 13, color: "#9ca3af", textAlign: "center", mt: 3 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}