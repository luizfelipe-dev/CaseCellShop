const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(status, errorCode, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.errorCode || 'unknown_error',
      data.message || 'Ocorreu um erro inesperado.'
    );
  }

  return data;
}

export function fetchProducts() {
  return request('/products');
}

export function submitCheckout(payload) {
  return request('/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchOrderStatus(uid) {
  return request(`/orders/${uid}`);
}

export { ApiError, API_BASE_URL };
