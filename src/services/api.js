import axios from "axios";

// En local      : /api  (proxy package.json → localhost:8020)
// En production : https://ton-app.railway.app/api  (variable d'environnement Vercel)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
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
  payByCard: (data) => API.post("/payment/pay", data),
};
