const API_BASE_URL = 'http://localhost:3000';

// Utility function para fazer requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  me: async () => {
    return apiRequest('/me');
  }
};

// Service Providers API
export const serviceAPI = {
  searchProviders: async (params) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/search-service-providers?${searchParams}`);
  },

  getProviderDetails: async (cnpjBasico) => {
    return apiRequest(`/provider/${cnpjBasico}`);
  },

  getClaimedProviders: async () => {
    return apiRequest('/my-claimed-providers');
  },

  getLikedProviders: async () => {
    return apiRequest('/my-liked-providers');
  },

  likeProvider: async (cnpjBasico) => {
    return apiRequest('/like-provider', {
      method: 'POST',
      body: JSON.stringify({ cnpj_basico: cnpjBasico })
    });
  }
};

// Comments API
export const commentsAPI = {
  getProviderComments: async (cnpjBasico) => {
    return apiRequest(`/provider-comments/${cnpjBasico}`);
  },

  addComment: async (cnpjBasico, comment) => {
    return apiRequest('/add-provider-comment', {
      method: 'POST',
      body: JSON.stringify({
        cnpj_basico: cnpjBasico,
        comment: comment
      })
    });
  }
};