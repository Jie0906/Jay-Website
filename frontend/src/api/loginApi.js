// src/api/loginApi.js

import { apiCall } from './common/apiCall';

export const login = async (username, password) => {
  try {
    const response = await apiCall('/admin/login', 'POST', { username, password });
    console.log(`Responese: ${response}`)
    
    // 設置 cookie
    document.cookie = `jsonWebToken=${response.jsonWebToken}; path=/; Secure; SameSite=Strict`;
    document.cookie = `sessionId=${response.sessionId}; path=/; Secure; SameSite=Strict`;

    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};