import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Switch,
  FormControlLabel, Alert, Divider, CircularProgress,
} from "@mui/material";
import { getSettings, updateSettings } from "../api/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    getSettings()
      .then((r) => setSettings(r.data))
      .catch(() => setError("Could not load settings."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSuccess(false); setError("");
    try {
      const { data } = await updateSettings(settings);
      setSettings(data.settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Could not save settings."); }
    finally { setSaving(false); }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress sx={{ color: "#6366f1" }} /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}>Settings</Typography>
        <Typography sx={{ fontSize: 14, color: "#303d51" }}>Manage your notification preferences</Typography>
      </Box>

      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Settings saved successfully.</Alert>}

      <Card sx={{ maxWidth: 560 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1e1b4b", mb: 0.5 }}>
            Notification preferences
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#9ca3af", mb: 2.5 }}>
            Control how and when you receive bill reminders
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Remind me (days before due date)"
              type="number"
              value={settings?.reminderDaysBefore ?? 3}
              onChange={(e) => setSettings((p) => ({ ...p, reminderDaysBefore: Number(e.target.value) }))}
              inputProps={{ min: 1, max: 30 }}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <FormControl fullWidth>
              <InputLabel>Notification type</InputLabel>
              <Select
                value={settings?.notificationType ?? "email"}
                label="Notification type"
                onChange={(e) => setSettings((p) => ({ ...p, notificationType: e.target.value }))}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="email">Email only</MenuItem>
                <MenuItem value="in-app">In-app only</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ borderColor: "#f5f3ff" }} />

            {[
              { key: "emailNotifications", label: "Email notifications", sub: "Receive reminders at your registered email" },
              { key: "inAppNotifications", label: "In-app notifications", sub: "Show reminders inside BillEase" },
            ].map((s) => (
              <Box key={s.key} sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                p: 2, background: "#f8f9ff", borderRadius: 2, border: "1px solid #ede9fe",
              }}>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#1e1b4b" }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>{s.sub}</Typography>
                </Box>
                <Switch
                  checked={settings?.[s.key] ?? false}
                  onChange={(e) => setSettings((p) => ({ ...p, [s.key]: e.target.checked }))}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#6366f1" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#6366f1" },
                  }}
                />
              </Box>
            ))}
          </Box>

          <Button
            variant="contained" sx={{ mt: 3, borderRadius: 2, px: 4 }}
            onClick={handleSave} disabled={saving}
          >
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}