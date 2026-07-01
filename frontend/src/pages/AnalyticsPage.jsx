import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Grid,
  CircularProgress, Alert,
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { getBills } from "../api/bills";

const CAT_COLORS = {
  electricity: "#6366f1",
  rent:        "#8b5cf6",
  water:       "#06b6d4",
  phone:       "#f59e0b",
  subscription:"#ec4899",
  other:       "#64748b"
};

const STAT_STYLES = [
  { label: "Total tracked",  color: "#6366f1", bg: "#f5f3ff" },
  { label: "Total paid",     color: "#059669", bg: "#d1fae5" },
  { label: "Total overdue",  color: "#dc2626", bg: "#fee2e2" },
  { label: "Payment rate",   color: "#d97706", bg: "#fef3c7" },
];

export default function AnalyticsPage() {
  const [bills, setBills]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getBills()
      .then((r) => setBills(r.data))
      .catch(() => setError("Could not load data."))
      .finally(() => setLoading(false));
  }, []);

  // monthly bar chart data
  const monthlyMap = {};
  bills.forEach((b) => {
    const m = new Date(b.dueDate).toLocaleString("default", {
      month: "short", year: "2-digit",
    });
    if (!monthlyMap[m]) monthlyMap[m] = { month: m, total: 0, paid: 0 };
    monthlyMap[m].total += Number(b.amount);
    if (b.Status === "paid") monthlyMap[m].paid += Number(b.amount);
  });
  const monthlyData = Object.values(monthlyMap).slice(-8);

  // pie chart data
  const catMap = {};
  bills.forEach((b) => {
    if (!catMap[b.Category]) catMap[b.Category] = 0;
    catMap[b.Category] += Number(b.amount);
  });
  const catData = Object.entries(catMap).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  // summary stats
  const total    = bills.reduce((s, b) => s + Number(b.amount), 0);
  const paid     = bills.filter((b) => b.Status === "paid").reduce((s, b) => s + Number(b.amount), 0);
  const overdue  = bills.filter((b) => b.Status === "overdue").reduce((s, b) => s + Number(b.amount), 0);
  const paidRate = total > 0 ? ((paid / total) * 100).toFixed(0) : 0;

  const statValues = [
    `$${total.toFixed(2)}`,
    `$${paid.toFixed(2)}`,
    `$${overdue.toFixed(2)}`,
    `${paidRate}%`,
  ];

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <CircularProgress sx={{ color: "#6366f1" }} />
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}>
          Analytics
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#303d51" }}>
          Understand your spending patterns
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Summary stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {STAT_STYLES.map((s, i) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ border: "1px solid #ede9fe" }}>
              <CardContent sx={{ p: 2.5, position: "relative", overflow: "hidden" }}>
                <Box sx={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  height: 3, background: s.color, borderRadius: "12px 12px 0 0",
                }} />
                <Typography sx={{
                  fontSize: 11, color: "#9ca3af", mb: 1,
                  fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em",
                }}>
                  {s.label}
                </Typography>
                <Typography sx={{ fontSize: 24, fontWeight: 700, color: s.color }}>
                  {statValues[i]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Monthly bar chart */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ border: "1px solid #ede9fe" }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1e1b4b", mb: 2 }}>
                Monthly spending
              </Typography>
              {monthlyData.length === 0 ? (
                <Typography sx={{ color: "#9ca3af", textAlign: "center", py: 4, fontSize: 14 }}>
                  No data yet.
                </Typography>
              ) : (
                <ResponsiveContainer width="300" height={280}>
                  <BarChart data={monthlyData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip
                      formatter={(v) => `$${v.toFixed(2)}`}
                      contentStyle={{ borderRadius: 8, border: "1px solid #ede9fe", fontSize: 12 }}
                    />
                    <Bar dataKey="total" fill="#c7d2fe" radius={[4,4,0,0]} name="Total" />
                    <Bar dataKey="paid"  fill="#6366f1" radius={[4,4,0,0]} name="Paid" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pie chart — full width */}
        <Grid item xs={16}>
          <Card sx={{ border: "1px solid #ede9fe" }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1e1b4b", mb: 2 }}>
                Spending by category
              </Typography>
              {catData.length === 0 ? (
                <Typography sx={{ color: "#9ca3af", textAlign: "center", py: 4, fontSize: 14 }}>
                  No data yet.
                </Typography>
              ) : (
                <ResponsiveContainer width="400" height={400}>
                  <PieChart>
                    <Pie
                      data={catData}
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      innerRadius={60}
                      dataKey="value"
                      paddingAngle={3}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={true}
                      fontSize={12}
                    >
                      {catData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={CAT_COLORS[entry.name] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                    <Legend
                      formatter={(value) =>
                        <span style={{ fontSize: 13, color: "#374151" }}>{value}</span>
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}