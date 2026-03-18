import axios from "axios";

// En local      : /api  (proxy package.json)
// En production : https://chronos-backend-production-b742.up.railway.app/api
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 30000, // ← 30 secondes — GIM Pay peut prendre jusqu'à 22s
});

export const watchApi = {
  getAll: (params) => API.get("/watches", { params }),
  getById: (id) => API.get(`/watches/${id}`),
};

export const categoryApi = {
  getAll: () => API.get("/categories"),
};

export const userApi = {
  create: (data) => API.post("/users", data),
  getById: (id) => API.get(`/users/${id}`),
};

export const cartApi = {
  getCart: (userId) => API.get(`/cart/${userId}`),
  addItem: (userId, data) => API.post(`/cart?userId=${userId}`, data),
  updateItem: (itemId, userId, data) =>
    API.put(`/cart/${itemId}?userId=${userId}`, data),
  removeItem: (itemId, userId) =>
    API.delete(`/cart/${itemId}?userId=${userId}`),
  clearCart: (userId) => API.delete(`/cart/clear/${userId}`),
};

export const orderApi = {
  createOrder: (data) => API.post("/orders", data),
  getByUser: (userId) => API.get(`/orders/user/${userId}`),
  getById: (id) => API.get(`/orders/${id}`),
};

export const paymentApi = {
  payByCard: (data) => API.post("/payment/pay", data, { timeout: 60000 }), // ← 60s pour le paiement
};
