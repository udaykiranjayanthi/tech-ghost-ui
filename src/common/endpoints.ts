// Get environment variables
const API_BASE_URL = process.env.API_BASE_URL;
const AUTH_URL = process.env.AUTH_URL;
const MESSAGING_WS_URL = process.env.MESSAGING_WS_URL;

const ENDPOINTS = {
  POSTS: `${API_BASE_URL}/posts`,
  CURRENT_USER: `${API_BASE_URL}/users/me`,
  USERS: `${API_BASE_URL}/users/profile`,
  USERS_DATA: `${API_BASE_URL}/users/profile/users`,
  SEARCH_USERS: `${API_BASE_URL}/users/search`,
  SAVED_POSTS: `${API_BASE_URL}/users/saved-posts`,
  LOGIN: `${AUTH_URL}/google`,
  MESSAGING_WS: MESSAGING_WS_URL,
};

export default ENDPOINTS;
