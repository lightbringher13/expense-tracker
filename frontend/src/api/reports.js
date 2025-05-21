// src/api/reports.js
import axiosClient from './axiosClient';

/**
 * Get monthly totals for the current user.
 * @returns {Promise} Axios response promise with data: [{ year, month, total }]
 */
export function fetchMonthlyTotals() {
  return axiosClient.get('/reports/monthly');
}

/**
 * Get category totals for the current user.
 * @returns {Promise} Axios response promise with data: [{ category, total }]
 */
export function fetchCategoryTotals() {
  return axiosClient.get('/reports/by-category');
}