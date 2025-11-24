import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a new short link
 */
export async function createLink(targetUrl, customCode = null) {
  try {
    const response = await api.post('/api/links', {
      target_url: targetUrl,
      code: customCode || undefined,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 409) {
      return { success: false, error: 'Code already exists' };
    }
    if (error.response?.status === 400) {
      return {
        success: false,
        error: error.response?.data?.error || 'Invalid input. Please check your URL and code.',
      };
    }
    if (!error.response) {
      return {
        success: false,
        error: 'Cannot connect to server. Please make sure the backend is running.',
      };
    }
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create link',
    };
  }
}

/**
 * Get all links
 */
export async function getAllLinks() {
  try {
    const response = await api.get('/api/links');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch links',
    };
  }
}

/**
 * Get stats for a specific link
 */
export async function getLinkStats(code) {
  try {
    const response = await api.get(`/api/links/${code}`);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, error: 'Link not found', notFound: true };
    }
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch link stats',
    };
  }
}

/**
 * Delete a link
 */
export async function deleteLink(code) {
  try {
    await api.delete(`/api/links/${code}`);
    return { success: true };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, error: 'Link not found' };
    }
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to delete link',
    };
  }
}

/**
 * Get short URL for a code
 * Uses backend URL since redirect happens on backend
 */
export function getShortUrl(code) {
  // Use backend URL for redirects
  const backendUrl = import.meta.env.VITE_API_URL;
  // Remove /api if present in API URL
  const baseUrl = backendUrl.replace(/\/api$/, '');
  return `${baseUrl}/${code}`;
}


