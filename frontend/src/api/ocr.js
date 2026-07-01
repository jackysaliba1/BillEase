import client from "./client";

export const scanBill = (formData) =>
  client.post("/ocr/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });