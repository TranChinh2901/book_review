const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://book-review-backend-scwc.onrender.com";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(body?.message ?? "Request failed");
    error.status = response.status;
    error.fields = body && !body.message ? body : {};
    throw error;
  }

  return body;
}

export const api = {
  listAuthors: () => request("/api/authors"),
  createAuthor: (payload) => request("/api/authors", { method: "POST", body: JSON.stringify(payload) }),
  updateAuthor: (id, payload) => request(`/api/authors/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteAuthor: (id) => request(`/api/authors/${id}`, { method: "DELETE" }),

  listBooks: () => request("/api/books"),
  createBook: (payload) => request("/api/books", { method: "POST", body: JSON.stringify(payload) }),
  updateBook: (id, payload) => request(`/api/books/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteBook: (id) => request(`/api/books/${id}`, { method: "DELETE" }),

  listReviews: () => request("/api/reviews"),
  createReview: (payload) => request("/api/reviews", { method: "POST", body: JSON.stringify(payload) }),
  updateReview: (id, payload) => request(`/api/reviews/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteReview: (id) => request(`/api/reviews/${id}`, { method: "DELETE" })
};
