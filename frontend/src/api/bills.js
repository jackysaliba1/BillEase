import client from "./client";

export const getBills    = ()         => client.get("/bills");
export const getBillById = (id)       => client.get(`/bills/${id}`);
export const createBill  = (data)     => client.post("/bills", data);
export const updateBill  = (id, data) => client.put(`/bills/${id}`, data);
export const deleteBill  = (id)       => client.delete(`/bills/${id}`);
export const markAsPaid  = (id)       => client.patch(`/bills/${id}/pay`);