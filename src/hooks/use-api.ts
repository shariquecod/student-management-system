import axios, { AxiosResponse, AxiosError } from 'axios';
import { SAME_ORIGIN_API_BASE } from '@/lib/api-config';
import { authService } from '@/services/auth-services';
import { toast } from 'sonner';

// Clear auth data helper function
const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    // Clear auth cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Flag to prevent multiple concurrent token refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Map to store pending requests for deduplication
const pendingRequests = new Map<string, Promise<any>>();

export interface ApiClientOptions {
  timeout?: number; // Custom timeout in milliseconds
  baseUrl?: string; // Allow specifying a different base URL
}

export interface ApiClientReturn {
  request: (config: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    data?: any;
    params?: any;
    timeout?: number; // Allow per-request timeout override
    baseUrl?: string; // Allow per-request base URL override
    skipTokenRefresh?: boolean; // Skip token refresh for this request
    retries?: number; // Number of retry attempts
  }) => Promise<any>;
  get: (url: string, params?: any, timeout?: number, baseUrl?: string, retries?: number) => Promise<any>;
  post: (url: string, data?: any, timeout?: number, baseUrl?: string, skipTokenRefresh?: boolean, retries?: number) => Promise<any>;
  put: (url: string, data?: any, timeout?: number, baseUrl?: string, skipTokenRefresh?: boolean, retries?: number) => Promise<any>;
  patch: (url: string, data?: any, timeout?: number, baseUrl?: string, skipTokenRefresh?: boolean, retries?: number) => Promise<any>;
  delete: (url: string, timeout?: number, baseUrl?: string, skipTokenRefresh?: boolean, retries?: number) => Promise<any>;
}

// Create a singleton API client instance
const createApiClient = (options?: ApiClientOptions): ApiClientReturn => {
  const request = async (config: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    data?: any;
    params?: any;
    timeout?: number; // Allow per-request timeout override
    baseUrl?: string; // Allow per-request base URL override
    skipTokenRefresh?: boolean; // Skip token refresh for this request
    retries?: number; // Number of retry attempts
  }): Promise<any> => {
    // Default to 3 retries for all calls as per user request
    const maxRetries = config.retries !== undefined ? config.retries : 3;
    let attempt = 0;

    const executeRequest = async (): Promise<any> => {
      try {
        // Prepare headers
        const headers: any = {
          Accept: 'application/json',
          'X-Timestamp': Date.now().toString(),
        };

        // Set content type based on request body
        if (config.data instanceof FormData) {
          headers['Content-Type'] = 'multipart/form-data';
        } else if (config.data instanceof URLSearchParams) {
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else if (config.data) {
          headers['Content-Type'] = 'application/json';
        }

        // Determine base URL to use
        const isAbsoluteUrl = config.url.startsWith('http://') || config.url.startsWith('https://');
        const baseUrl = isAbsoluteUrl
          ? ''
          : (config.baseUrl !== undefined ? config.baseUrl : (options?.baseUrl ?? SAME_ORIGIN_API_BASE));

        // Add auth token if available
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token') || localStorage.getItem('authToken');
          if (token && token !== 'authenticated') {
            headers.Authorization = `Bearer ${token}`;
          }
        }

        // Use custom timeout if provided, otherwise use default from options, otherwise use 5 minutes (300000ms)
        const timeoutMs = config.timeout || options?.timeout || 300000;

        // Add more detailed logging to help diagnose API connection issues
        console.log(`🕐 [apiClient] Request timeout set to: ${timeoutMs}ms (${timeoutMs / 1000}s)`);
        console.log(`🔄 [apiClient] ${config.method} request to: ${baseUrl}${config.url} (Attempt ${attempt + 1})`);

        try {
          const response: AxiosResponse = await axios({
            method: config.method,
            url: `${baseUrl}${config.url}`,
            data: config.data,
            params: config.params,
            headers,
            timeout: timeoutMs,
            // Only resolve if status is successful (no retry for 500 here)
            validateStatus: function (status) {
              return status < 500;
            }
          });

          return response.data;
        } catch (error) {
          // USER REQUEST: this retry should only work if api call exceed 5 minutes (timeout)
          if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
            console.log(`⏰ [apiClient] Request timeout exceeded: ${timeoutMs}ms`);
            if (attempt < maxRetries) {
              console.warn(`⚠️ [apiClient] Timeout occurred, retrying... (Attempt ${attempt + 1}/${maxRetries})`);
              attempt++;
              return executeRequest();
            }
            throw new Error(`Request timeout exceeded (${timeoutMs / 1000}s). Please try again later.`);
          }

          if (axios.isAxiosError(error) && !error.response) {
            console.error('🌐 [apiClient] Network error: Unable to reach the API server');
            // Assuming network error is also a form of timeout/unavailable service that warrants retry
            if (attempt < maxRetries) {
              console.warn(`⚠️ [apiClient] Network error, retrying... (Attempt ${attempt + 1}/${maxRetries})`);
              attempt++;
              return executeRequest();
            }
            throw new Error('Network error: Unable to reach the API server. Please try again later.');
          }

          // Handle 401 errors - attempt token refresh and retry
          if (axios.isAxiosError(error) && error.response?.status === 401 && !config.skipTokenRefresh) {
            console.log('🔒 [apiClient] Authentication error (401), attempting token refresh');

            if (!isRefreshing) {
              isRefreshing = true;
              refreshPromise = authService.refreshToken().finally(() => {
                isRefreshing = false;
                refreshPromise = null;
              });
            }

            try {
              const refreshResult = await refreshPromise;

              if (refreshResult.success) {
                console.log('✅ [apiClient] Token refreshed successfully, retrying request');
                const retryResponse = await axios({
                  method: config.method,
                  url: `${baseUrl}${config.url}`,
                  data: config.data,
                  params: config.params,
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${refreshResult.token}`
                  },
                  timeout: timeoutMs,
                  validateStatus: function (status) {
                    return status < 500;
                  }
                });

                return retryResponse.data;
              } else {
                clearAuthData();
                require('@/redux/store').store.dispatch(require('@/redux/slices/authSlice').logout());
                if (typeof window !== 'undefined') {
                  localStorage.setItem('redirectToLogin', 'true');
                }
                throw new Error('Authentication expired. Please log in again.');
              }
            } catch (refreshError) {
              clearAuthData();
              require('@/redux/store').store.dispatch(require('@/redux/slices/authSlice').logout());
              if (typeof window !== 'undefined') {
                localStorage.setItem('redirectToLogin', 'true');
              }
              throw new Error('Authentication expired. Please log in again.');
            }
          }

          // Handle server errors (4xx) that return error messages
          if (axios.isAxiosError(error) && error.response && error.response.status >= 400) {
            const apiErrorMessage = error.response.data?.message ||
              error.response.data?.error ||
              `HTTP ${error.response.status}: ${error.response.statusText}`;

            return {
              success: false,
              error: error.response.data?.error || `HTTP_${error.response.status}`,
              message: apiErrorMessage,
              details: error.response.data
            };
          }

          throw error;
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
          console.log('⏰ [apiClient] Request timeout occurred final');
        }

        if (axiosError.response?.status === 401) {
          if (config.url.includes('/auth/login') || config.url.includes('/auth/signin') || config.url.includes('/auth/register')) {
            return {
              success: false,
              error: 'INVALID_CREDENTIALS',
              message: 'Invalid email or password'
            };
          }
          clearAuthData();
          require('@/redux/store').store.dispatch(require('@/redux/slices/authSlice').logout());
          if (typeof window !== 'undefined') {
            localStorage.setItem('redirectToLogin', 'true');
          }
        }
        throw axiosError;
      }
    };

    // Generate a unique key for deduplication based on method, URL, and data
    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${
      config.data instanceof FormData ? 'form-data' : JSON.stringify(config.data || {})
    }`;

    // If an identical request is already pending, return its promise
    if (pendingRequests.has(requestKey)) {
      console.log(`📡 [apiClient] Deduplicating active request: ${config.method} ${config.url}`);
      return pendingRequests.get(requestKey);
    }

    const requestPromise = (async () => {
      try {
        return await executeRequest();
      } finally {
        // Remove from pending list when finished (success or error)
        pendingRequests.delete(requestKey);
      }
    })();

    // Store the promise in the map
    pendingRequests.set(requestKey, requestPromise);

    return requestPromise;
  };

  const get = (url: string, params?: any, timeout?: number, baseUrl?: string, retries?: number) =>
    request({ method: 'GET', url, params, timeout, baseUrl, retries });

  const post = (url: string, data?: any, timeout?: number, baseUrl?: string, skipTokenRefresh?: boolean, retries?: number) =>
    request({ method: 'POST', url, data, timeout, baseUrl, skipTokenRefresh, retries });

  const put = (url: string, data?: any, timeout?: number, baseUrl?: string, skipTokenRefresh?: boolean, retries?: number) =>
    request({ method: 'PUT', url, data, timeout, baseUrl, skipTokenRefresh, retries });

  const patch = (url: string, data?: any, timeout?: number, baseUrl?: string, skipTokenRefresh?: boolean, retries?: number) =>
    request({ method: 'PATCH', url, data, timeout, baseUrl, skipTokenRefresh, retries });

  const deleteRequest = (url: string, timeout?: number, baseUrl?: string, skipTokenRefresh?: boolean, retries?: number) =>
    request({ method: 'DELETE', url, timeout, baseUrl, skipTokenRefresh, retries });

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: deleteRequest,
  };
};

// Create a singleton instance
export const apiClient = createApiClient();

// For backward compatibility
export const useApi = () => apiClient;
