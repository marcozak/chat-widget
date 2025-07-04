// utils/api/index.js - Updated for JWT authentication
import { getToken, isAuthenticated } from '@/utils/auth'

export const getApiBaseUrl = import.meta.env.VITE_API_BASE_URL

// WebSocket URL constructor with auth token
export const getWebSocketUrl = (sessionId) => {
  const token = getToken()
  const baseUrl = getApiBaseUrl.replace('http', 'ws')
  
  // If authenticated, include token in WebSocket connection
  if (token) {
    return `${baseUrl}/ws/${sessionId}?token=${token}`
  }
  
  return `${baseUrl}/ws/${sessionId}`
}

// HTTP request helper with authentication
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${getApiBaseUrl}${endpoint}`
  
  console.log(`Making ${options.method || 'GET'} request to:`, url)
  
  // Prepare headers with authentication if user is logged in
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {})
  }
  
  // Add JWT bearer token if available
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log('Authorization header added')
  } else {
    console.log('No authorization token available')
  }
  
  console.log('Request headers:', headers)
  if (options.body) {
    console.log('Request body:', options.body)
  }
  
  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  console.log(`Response status: ${response.status} ${response.statusText}`)
  
  // Handle unauthorized responses
  if (response.status === 401) {
    console.warn('Unauthorized response (401)')
    // Handle token expiration - redirect to login
    if (isAuthenticated()) {
      // Clear session and redirect
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
      window.location.href = '/login?session=expired'
      return null
    }
  }
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`)
    const error = new Error(`API error: ${response.status} ${response.statusText}`)
    error.status = response.status
    error.response = response
    
    try {
      // Try to parse error details from response
      const data = await response.json()
      console.error('Error response data:', data)
      error.data = data
    } catch (e) {
      console.error('Could not parse error response as JSON')
      // Response couldn't be parsed as JSON
    }
    
    throw error
  }
  
  // For 204 No Content responses
  if (response.status === 204) {
    console.log('Received 204 No Content response')
    return null
  }
  
  // Return parsed response if successful
  const responseData = await response.json()
  console.log('Response data:', responseData)
  return responseData
}

// Send question to API with authentication
export const sendQuestion = async (question, sessionId) => {
  const payload = {
    question,
    model_name: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    session_id: sessionId,
    workspace_id: 'f5e7f2c7-3f86-4972-9793-52ba603c9e3f',
    generate_proposals: true
  }
  
  console.log('POST /ask payload:', payload)
  
  return fetchApi('/ask', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

// Login function
export const apiLogin = async (email, password, rememberMe = false) => {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      remember_me: rememberMe
    })
  })
}

// Logout function
export const apiLogout = async () => {
  return fetchApi('/auth/logout', {
    method: 'POST'
  })
}

// Get current user profile
export const getCurrentUser = async () => {
  return fetchApi('/auth/me', {
    method: 'GET'
  })
}