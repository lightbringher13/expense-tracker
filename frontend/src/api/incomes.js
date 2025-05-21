// src/api/incomes.js
import axiosClient from "./axiosClient";

export function fetchIncomes() {
  return axiosClient.get("/incomes");
}
export function fetchIncomeById(id) {
  return axiosClient.get(`/incomes/${id}`);
}
export function createIncome(data) {
  return axiosClient.post("/incomes", data);
}
export function updateIncome(id, data) {
  return axiosClient.put(`/incomes/${id}`, data);
}
export function deleteIncome(id) {
  return axiosClient.delete(`/incomes/${id}`);
}