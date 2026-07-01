import client from "./client";

export const getDashboardStats = () => client.get("/reports/dashboard");
export const getMonthlyReport  = () => client.get("/reports/monthly");
export const getUnpaidSummary  = () => client.get("/reports/unpaid");