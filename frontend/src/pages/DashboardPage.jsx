import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Grid,
  CircularProgress, Alert, Chip, Table,
  TableBody, TableCell, TableContainer,
  TableHead, TableRow,
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import ReceiptLongOutlinedIcon  from "@mui/icons-material/ReceiptLongOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlinedIcon  from "@mui/icons-material/CheckCircleOutlined";
import PendingOutlinedIcon      from "@mui/icons-material/PendingOutlined";
import { getBills } from "../api/bills";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  paid:    { bg: "#d1fae5", color: "#065f46" },
  overdue: { bg: "#fee2e2", color: "#991b1b" },
};

const KPI_STYLES = [
  { accent: "linear-gradient(90deg,#6366f1,#8b5cf6)", icon: <ReceiptLongOutlinedIcon />,  iconColor: "#6366f1", iconBg: "#f5f3ff" },
  { accent: "linear-gradient(90deg,#f59e0b,#ef4444)", icon: <PendingOutlinedIcon />,       iconColor: "#d97706", iconBg: "#fef3c7" },
  { accent: "linear-gradient(90deg,#ef4444,#dc2626)", icon: <WarningAmberOutlinedIcon />,  iconColor: "#dc2626", iconBg: "#fee2e2" },
  { accent: "linear-gradient(90deg,#10b981,#059669)", icon: <CheckCircleOutlinedIcon />,   iconColor: "#059669", iconBg: "#d1fae5" },
];

function KpiCard({ title, value, subtitle, style }) {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, position: "relative", overflow: "hidden" }}>
        <Box sx={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 3, background: style.accent, borderRadius: "12px 12px 0 0",
        }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mt: 0.5 }}>
          <Box>
            <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: 1, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#1e1b4b", mb: 0.5 }}>{value}</Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>{subtitle}</Typography>
          </Box>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            background: style.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: style.iconColor,
          }}>
            {style.icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [bills, setBills]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getBills()
      .then((r) => setBills(r.data))
      .catch(() => setError("Could not load bills."))
      .finally(() => setLoading(false));
  }, []);

  const paid    = bills.filter((b) => b.Status === "paid");
  const pending = bills.filter((b) => b.Status === "pending");
  const overdue = bills.filter((b) => b.Status === "overdue");
  const paidTotal    = paid.reduce((s, b) => s + Number(b.amount), 0);
  const pendingTotal = pending.reduce((s, b) => s + Number(b.amount), 0);
  const overdueTotal = overdue.reduce((s, b) => s + Number(b.amount), 0);

  const monthlyMap = {};
  bills.forEach((b) => {
    const m = new Date(b.dueDate).toLocaleString("default", { month: "short" });
    if (!monthlyMap[m]) monthlyMap[m] = { month: m, paid: 0, pending: 0, overdue: 0 };
    monthlyMap[m][b.Status] += Number(b.amount);
  });
  const chartData = Object.values(monthlyMap).slice(-6);

  const recent = [...bills]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const upcoming = bills
    .filter((b) => b.Status === "pending")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <CircularProgress sx={{ color: "#6366f1" }} />
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}>
            Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#303d51", mt: 0.5 }}>
            Here's your bill summary for {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* KPI cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: "Total bills",   value: bills.length,              subtitle: "all time",                         style: KPI_STYLES[0] },
          { title: "Pending",       value: `$${pendingTotal.toFixed(2)}`, subtitle: `${pending.length} bill(s)`,    style: KPI_STYLES[1] },
          { title: "Overdue",       value: `$${overdueTotal.toFixed(2)}`, subtitle: `${overdue.length} bill(s)`,    style: KPI_STYLES[2] },
          { title: "Paid this month", value: `$${paidTotal.toFixed(2)}`, subtitle: `${paid.length} bill(s)`,        style: KPI_STYLES[3] },
        ].map((k) => (
          <Grid item xs={12} sm={6} md={3} key={k.title}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#1e1b4b", mb: 2 }}>
                Monthly overview
              </Typography>
              {chartData.length === 0 ? (
                <Typography sx={{ color: "#9ca3af", textAlign: "center", py: 4, fontSize: 14 }}>
                  No data yet — add some bills to see your chart.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip
                      formatter={(v) => `$${v.toFixed(2)}`}
                      contentStyle={{ borderRadius: 8, border: "1px solid #ede9fe", fontSize: 12 }}
                    />
                    <Bar dataKey="paid"    fill="#059669" radius={[4,4,0,0]} name="Paid" />
                    <Bar dataKey="pending" fill="#d97706" radius={[4,4,0,0]} name="Pending" />
                    <Bar dataKey="overdue" fill="#dc2626" radius={[4,4,0,0]} name="Overdue" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming bills */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#1e1b4b", mb: 2 }}>
                Upcoming bills
              </Typography>
              {upcoming.length === 0 ? (
                <Typography sx={{ color: "#9ca3af", fontSize: 14, textAlign: "center", py: 3 }}>
                  No upcoming bills.
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {upcoming.map((b, i) => (
                    <Box key={b.id} sx={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      py: 1.2,
                      borderBottom: i < upcoming.length - 1 ? "1px solid #f5f3ff" : "none",
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
                        <Box>
                          <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#1e1b4b" }}>
                            {b.Description}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>
                            {new Date(b.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#dc2626" }}>
                        ${Number(b.amount).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent bills table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: "#1e1b4b", mb: 2 }}>
                Recent bills
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Due date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recent.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#9ca3af" }}>
                          No bills yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recent.map((b) => (
                        <TableRow key={b.id} hover>
                          <TableCell sx={{ fontSize: 13, fontWeight: 500, color: "#1e1b4b" }}>
                            {b.Description}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, color: "#6b7280", textTransform: "capitalize" }}>
                            {b.Category}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, color: "#6b7280" }}>
                            {new Date(b.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </TableCell>
                          <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#1e1b4b" }}>
                            ${Number(b.amount).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={b.Status}
                              size="small"
                              sx={{
                                bgcolor: STATUS_COLORS[b.Status]?.bg,
                                color:   STATUS_COLORS[b.Status]?.color,
                                fontWeight: 600, fontSize: 11, border: "none",
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}