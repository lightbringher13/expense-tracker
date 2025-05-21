// src/api/expenses.js
import axiosClient from './axiosClient';

/**
 * Fetch all expenses.
 * @returns {Promise} Axios response promise
 */
export function fetchExpenses() {
  return axiosClient.get('/expenses');
}

/**
 * Fetch a single expense by its ID.
 * @param {string|number} id
 * @returns {Promise} Axios response promise
 */
export function fetchExpenseById(id) {
  return axiosClient.get(`/expenses/${id}`);
}

/**
 * Create a new expense.
 * @param {Object} expenseData
 * @param {number|string} expenseData.amount
 * @param {number|string} expenseData.categoryId
 * @param {string} [expenseData.description]
 * @param {string} expenseData.expenseAt  // e.g. "2025-05-22T14:30"
 * @returns {Promise} Axios response promise
 */
export function createExpense(expenseData) {
  return axiosClient.post('/expenses', expenseData);
}

/**
 * Update an existing expense.
 * @param {string|number} id
 * @param {Object} expenseData  // same shape as createExpense
 * @returns {Promise} Axios response promise
 */
export function updateExpense(id, expenseData) {
  return axiosClient.put(`/expenses/${id}`, expenseData);
}

/**
 * Delete an expense by its ID.
 * @param {string|number} id
 * @returns {Promise} Axios response promise
 */
export function deleteExpense(id) {
  return axiosClient.delete(`/expenses/${id}`);
}