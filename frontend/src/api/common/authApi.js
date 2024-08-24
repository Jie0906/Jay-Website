// src/api/common/authApi.js

import { apiCall } from './apiCall';

// 輔助函數：從 cookie 中獲取值
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const authApi = {
  call: async (endpoint, method, data = null, isFileUpload = false) => {
    // 從 cookie 中獲取 token 和 sessionId
    const token = getCookie('jsonWebToken');
    const sessionId = getCookie('sessionId');
    console.log(`!!!!!!!!!!!!!!${token}`)
    console.log(`??????????${sessionId}`)

    let headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header:', headers['Authorization']); // 用於調試
    }
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }

    try {
      return await apiCall(endpoint, method, data, isFileUpload, headers);
    } catch (error) {
      if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
        // 處理授權錯誤，例如重定向到登錄頁面
        console.error('Authorization error:', error);
        window.location.href = '/login';
      }
      throw error;
    }
  }
};