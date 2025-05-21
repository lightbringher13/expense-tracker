// src/api/categories.js
import axiosClient from './axiosClient';

/**
 * Fetch all categories.
 * @returns {Promise} Axios response promise
 */
export function fetchCategories() {
  return axiosClient.get('/categories');
}

/**
 * Fetch a single category by its ID.
 * @param {string|number} id
 * @returns {Promise}
 */
export function fetchCategoryById(id) {
  return axiosClient.get(`/categories/${id}`);
}

/**
 * Create a new category.
 * @param {{ name: string, type: 'EXPENSE' | 'INCOME' }} data
 * @returns {Promise}
 */
export function createCategory(data) {
  return axiosClient.post('/categories', data);
}

/**
 * Update an existing category.
 * @param {string|number} id
 * @param {{ name: string, type: 'EXPENSE' | 'INCOME' }} data
 * @returns {Promise}
 */
export function updateCategory(id, data) {
  return axiosClient.put(`/categories/${id}`, data);
}

/**
 * Delete a category.
 * @param {string|number} id
 * @returns {Promise}
 */
export function deleteCategory(id) {
  return axiosClient.delete(`/categories/${id}`);
}