// utils/auth.js - Updated for JWT authentication
import { apiLogin, apiLogout } from './api'

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken'
const USER_INFO_KEY = 'userInfo'

/**
 * Handle user login
 * @param {string} email User email
 * @param {string} password User password
 * @param {boolean} rememberMe Whether to remember the user
 * @returns {Promise<object>} User data and token
 */
export const login = async (email, password, rememberMe = false) => {
  try {
    // Call the API login endpoint
    const response = await apiLogin(email, password, rememberMe)
    
    // Store authentication data
    localStorage.setItem(ACCESS_TOKEN_KEY, response.token)
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(response.user))
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Log user out
 */
export const logout = async () => {
  try {
    // Call the API logout endpoint
    await apiLogout()
  } catch (e) {
    // Continue with client-side logout even if server request fails
    console.warn('Error during logout request:', e)
  }
  
  // Clear local storage
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_INFO_KEY)
  
  // Redirect to login
  window.location.href = '/login'
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication state
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Get current user information
 * @returns {object|null} User data or null if not authenticated
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

/**
 * Get authentication token
 * @returns {string|null} Auth token or null
 */
export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Update user information in storage
 * @param {object} userData Updated user data
 */
export const updateUserInfo = (userData) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData))
}