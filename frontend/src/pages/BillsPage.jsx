import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputLabel,
  MenuItem, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, Alert, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import { getBills, createBill, updateBill, deleteBill, markAsPaid } from "../api/bills";

const STATUS_COLORS = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  paid:    { bg: "#d1fae5", color: "#065f46" },
  overdue: { bg: "#fee2e2", color: "#991b1b" },
};

const CATEGORIES = ["electricity", "rent", "water", "phone", "subscription","other"];
const FILTERS    = ["all", "pending", "overdue", "paid"];
const EMPTY_FORM = { Description: "", amount: "", dueDate: "", Category: "" };

export default function BillsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bills, setBills]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filter, setFilter]       = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBill, setEditBill]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setLoading(true);
    getBills()
      .then((r) => setBills(r.data))
      .catch(() => setError("Could not load bills."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("prefill")) {
      setEditBill(null);
      setForm({
        Description: params.get("description") || "",
        amount:      params.get("amount")      || "",
        dueDate:     params.get("dueDate")     || "",
        Category:    params.get("category")    || "",
      });
      setFormError("");
      setDialogOpen(true);
      navigate("/app/bills", { replace: true });
    }
  }, [location.search]);

  const filtered = filter === "all" ? bills : bills.filter((b) => b.Status === filter);

  const openAdd = () => { setEditBill(null); setForm(EMPTY_FORM); setFormError(""); setDialogOpen(true); };
  const openEdit = (bill) => {
    setEditBill(bill);
    setForm({ Description: bill.Description, amount: bill.amount, dueDate: bill.dueDate?.split("T")[0], Category: bill.Category });
    setFormError(""); setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.Description || !form.amount || !form.dueDate || !form.Category) { setFormError("All fields are required."); return; }
    setSaving(true);
    try {
      editBill ? await updateBill(editBill.id, form) : await createBill(form);
      setDialogOpen(false); load();
    } catch (err) {
      setFormError(err.response?.data?.error || "Failed to save bill.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    try { await deleteBill(id); load(); }
    catch { setError("Could not delete bill."); }
  };

  const handleMarkPaid = async (id) => {
    try { await markAsPaid(id); load(); }
    catch (err) { setError(err.response?.data?.error || "Could not mark as paid."); }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress sx={{ color: "#6366f1" }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}>My Bills</Typography>
          <Typography sx={{ fontSize: 14, color: "#303d51" }}>Manage and track all your bills</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ borderRadius: 2 }}>
          Add bill
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

      {/* Summary mini cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
        {[
          { label: "Total unpaid", value: `$${bills.filter(b => b.Status !== "paid").reduce((s,b) => s + Number(b.amount), 0).toFixed(2)}`, color: "#dc2626", bg: "#fee2e2" },
          { label: "Bills total",  value: bills.length,                   color: "#6366f1", bg: "#f5f3ff" },
          { label: "Overdue",      value: bills.filter(b => b.Status === "overdue").length, color: "#d97706", bg: "#fef3c7" },
        ].map((s) => (
          <Box key={s.label} sx={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: 2, px: 2.5, py: 1.5, flex: 1 }}>
            <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 0.5, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>
              {s.label}
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            onClick={() => setFilter(f)}
            sx={
              filter === f
                ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 600, border: "none" }
                : { background: "#fff", border: "1px solid #ede9fe", color: "#6b7280", fontWeight: 500 }
            }
          />
        ))}
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Due date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#9ca3af" }}>No bills found.</TableCell>
                </TableRow>
              ) : (
                filtered.map((bill) => (
                  <TableRow key={bill.id} hover sx={{ "&:hover": { background: "#fafafa" } }}>
                    <TableCell><Typography sx={{ fontSize: 14, fontWeight: 500, color: "#1e1b4b" }}>{bill.Description}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: 13, color: "#6b7280", textTransform: "capitalize" }}>{bill.Category}</Typography></TableCell>
                    <TableCell sx={{ fontSize: 13, color: "#6b7280" }}>
                      {new Date(bill.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b" }}>${Number(bill.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={bill.Status} size="small" sx={{ bgcolor: STATUS_COLORS[bill.Status]?.bg, color: STATUS_COLORS[bill.Status]?.color, fontWeight: 600, fontSize: 11, border: "none", textTransform: "capitalize" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                        {bill.Status !== "paid" && (
                          <Tooltip title="Mark as paid">
                            <IconButton size="small" sx={{ color: "#059669", background: "#d1fae5", borderRadius: 1.5, "&:hover": { background: "#a7f3d0" } }} onClick={() => handleMarkPaid(bill.id)}>
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ color: "#6366f1", background: "#f5f3ff", borderRadius: 1.5, "&:hover": { background: "#ede9fe" } }} onClick={() => openEdit(bill)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" sx={{ color: "#dc2626", background: "#fee2e2", borderRadius: 1.5, "&:hover": { background: "#fecaca" } }} onClick={() => handleDelete(bill.id)}>
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: "#1e1b4b" }}>{editBill ? "Edit bill" : "Add new bill"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="Description" value={form.Description} onChange={(e) => setForm((p) => ({ ...p, Description: e.target.value }))} fullWidth />
          <TextField label="Amount ($)" type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} fullWidth inputProps={{ min: 0, step: "0.01" }} />
   <Box>
  <Typography sx={{ fontSize: 14, mb: 0.7, color: "#374151" }}>
    Due date
  </Typography>

  <TextField
    type="date"
    value={form.dueDate || ""}
    onChange={(e) =>
      setForm((p) => ({ ...p, dueDate: e.target.value }))
    }
    fullWidth
  />
</Box>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={form.Category} label="Category" onChange={(e) => setForm((p) => ({ ...p, Category: e.target.value }))}>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c} sx={{ textTransform: "capitalize" }}>{c}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: "#6b7280" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ borderRadius: 2, px: 3 }}>
            {saving ? "Saving…" : editBill ? "Save changes" : "Add bill"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}