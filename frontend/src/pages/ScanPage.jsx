import { useState, useRef } from "react";
import {
  Box, Button, Card, CardContent, Typography,
  Alert, CircularProgress, Chip, Divider,
} from "@mui/material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import { scanBill } from "../api/ocr";
import { useNavigate } from "react-router-dom";

export default function ScanPage() {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");
  const inputRef                  = useRef();
  const navigate                  = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const fd = new FormData();
    fd.append("bill", file);
    try {
      const { data } = await scanBill(fd);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Scan failed. Try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseBill = () => {
    if (!result?.extracted) return;
    const { amount, dueDate, Description, Category } = result.extracted;
    const params = new URLSearchParams();
    if (amount)      params.set("amount", amount);
    if (dueDate)     params.set("dueDate", dueDate);
    if (Description) params.set("description", Description);
    if (Category)    params.set("category", Category);
    navigate(`/app/bills?prefill=1&${params.toString()}`);
  };

  return (
    <Box>
    <Box sx={{ mb: 3 }}>
  <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1e1b4b" }}>Scan a bill</Typography>
  <Typography sx={{ fontSize: 14, color: "#303d51" }}>
    Upload an image and we'll extract the details automatically
  </Typography>
   </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Upload area */}
        <Card sx={{ flex: 1, minWidth: 280 }}>
          <CardContent>
            <Box
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current.click()}
              sx={{
                border: "2px dashed",
                borderColor: file ? "primary.main" : "divider",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: file ? "primary.light" : "background.default",
                transition: "all .2s",
                "&:hover": { borderColor: "primary.main", bgcolor: "primary.light" },
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 8 }}
                />
              ) : (
                <>
                  <UploadFileOutlinedIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                  <Typography fontWeight={500}>Drop your bill image here</Typography>
                  <Typography fontSize={13} color="text.secondary" mt={0.5}>
                    or click to browse — JPG, PNG, WEBP up to 5MB
                  </Typography>
                </>
              )}
            </Box>

            {file && (
              <Typography fontSize={13} color="text.secondary" textAlign="center" mt={1}>
                {file.name}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              startIcon={loading ? null : <DocumentScannerOutlinedIcon />}
              onClick={handleScan}
              disabled={!file || loading}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Scan bill"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card sx={{ flex: 1, minWidth: 280 }}>
            <CardContent>
              <Typography fontWeight={600} fontSize={15} mb={2}>Extracted details</Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <ResultRow label="Amount"      value={result.extracted?.amount ? `$${result.extracted.amount}` : "—"} />
                <ResultRow label="Due date"    value={result.extracted?.dueDate || "—"} />
                <ResultRow label="Description" value={result.extracted?.Description || "—"} />
                <ResultRow label="Category"
                  value={
                    result.extracted?.Category
                      ? <Chip label={result.extracted.Category} size="small" color="primary" />
                      : "—"
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography fontWeight={600} fontSize={13} mb={1}>Raw text</Typography>
              <Box
                sx={{
                  bgcolor: "background.default",
                  borderRadius: 2,
                  p: 1.5,
                  maxHeight: 150,
                  overflow: "auto",
                  fontFamily: "monospace",
                  fontSize: 12,
                  whiteSpace: "pre-wrap",
                  color: "text.secondary",
                }}
              >
                {result.rawText || "No text extracted."}
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleUseBill}
              >
                Use these details to add a bill
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

function ResultRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography fontSize={13} color="text.secondary">{label}</Typography>
      <Typography fontSize={13} fontWeight={500}>{value}</Typography>
    </Box>
  );
}