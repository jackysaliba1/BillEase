import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Select,
  InputLabel, FormControl, Alert, IconButton, Chip, CircularProgress, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { getReminders, createReminder, deleteReminder } from "../api/reminders";
import { getBills } from "../api/bills";

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [bills, setBills]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [open, setOpen]           = useState(false);
  const [form, setForm]           = useState({ billId: "", reminderDate: "", reminderType: "email" });
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([getReminders(), getBills()])
      .then(([r, b]) => { setReminders(r.data); setBills(b.data); })
      .catch(() => setError("Could not load reminders."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.billId || !form.reminderDate) {
      setFormError("Bill and date are required.");
      return;
    }
    setSaving(true);
    try {
      await createReminder(form);
      setOpen(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.error || "Failed to create reminder.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await deleteReminder(id);
      load();
    } catch {
      setError("Could not delete reminder.");
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
    <Box>
    <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}>Reminders</Typography>
    <Typography sx={{ fontSize: 14, color: "#303d51" }}>Get notified before bills are due</Typography>
  </Box>
  <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }} onClick={() => { setForm({ billId: "", reminderDate: "", reminderType: "email" }); setFormError(""); setOpen(true); }}>
    Add reminder
  </Button>
</Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {reminders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary">No reminders set yet.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {reminders.map((r) => (
            <Card key={r.id}>
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: "14px !important" }}>
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    {r.Bills?.Description || `Bill #${r.billId}`}
                  </Typography>
                  <Typography fontSize={13} color="text.secondary" mt={0.3}>
                    Remind on {new Date(r.reminderDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={r.isSent ? "Sent" : "Pending"}
                    size="small"
                    sx={{
                      bgcolor: r.isSent ? "#EAF3DE" : "#EEEDFE",
                      color:   r.isSent ? "#3B6D11" : "#534AB7",
                      fontWeight: 600, fontSize: 11,
                    }}
                  />
                  <Chip label={r.reminderType} size="small" variant="outlined" />
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}>
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>New reminder</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <FormControl fullWidth>
            <InputLabel>Bill</InputLabel>
            <Select value={form.billId} label="Bill" onChange={(e) => setForm((p) => ({ ...p, billId: e.target.value }))}>
              {bills.filter((b) => b.Status !== "paid").map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.Description} — ${Number(b.amount).toFixed(2)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Reminder date"
            type="date"
            value={form.reminderDate}
            onChange={(e) => setForm((p) => ({ ...p, reminderDate: e.target.value }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={form.reminderType} label="Type" onChange={(e) => setForm((p) => ({ ...p, reminderType: e.target.value }))}>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="in-app">In-app</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Create reminder"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}