const BASE_URL = 'https://dummyjson.com';

// Generic fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Auth
export async function loginUser(username: string, password: string) {
  return apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

// Users
export async function fetchUsers(limit = 10, skip = 0) {
  return apiFetch(`/users?limit=${limit}&skip=${skip}&select=id,firstName,lastName,email,phone,gender,image,company`);
}

export async function searchUsers(query: string, limit = 10, skip = 0) {
  return apiFetch(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
}

export async function fetchUserById(id: number) {
  return apiFetch(`/users/${id}`);
}

// Products
export async function fetchProducts(limit = 10, skip = 0) {
  return apiFetch(`/products?limit=${limit}&skip=${skip}`);
}

export async function searchProducts(query: string, limit = 10, skip = 0) {
  return apiFetch(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
}

export async function fetchProductsByCategory(category: string, limit = 10, skip = 0) {
  return apiFetch(`/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
}

export async function fetchProductById(id: number) {
  return apiFetch(`/products/${id}`);
}

export async function fetchCategories(): Promise<string[]> {
  return apiFetch('/products/category-list');
}
