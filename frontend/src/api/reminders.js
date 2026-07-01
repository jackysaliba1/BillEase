import client from "./client";

export const getReminders   = ()     => client.get("/reminders");
export const createReminder = (data) => client.post("/reminders", data);
export const deleteReminder = (id)   => client.delete(`/reminders/${id}`);