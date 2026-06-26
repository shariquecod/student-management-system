// note: Dont change anything from this page [strictly follow the rules].

// API Base URLs from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
// export const API_AI_BASE_URL = process.env.NEXT_PUBLIC_API_AI_BASE_URL

// API Endpoints
export const endpoints = {
  auth: {
    register: '/api/v1/auth/register',                             // Register a new user
    refresh: '/api/v1/auth/refresh',                               // Refresh access token
    login: '/api/v1/auth/login',                                   // Login and get JWT tokens
  },
  student: {
    list: '/api/v1/students/list',                                 // Fetch paginated student list with search and filters
    create: '/api/v1/students',                                    // Create a new student
    getById: ({ id }: { id: string }) => `/api/v1/students/${id}`, // Fetch full student profile with all tabs
    update: ({ id }: { id: string }) => `/api/v1/students/${id}`,  // Update student record (partial update supported)
    delete: ({ id }: { id: string }) => `/api/v1/students/${id}`,  // Delete a student record
  }
}



