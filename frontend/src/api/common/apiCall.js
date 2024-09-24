import { triggerErrorPage } from '../../utils/errorHandling';  // 確保路徑正確

const API_URL = process.env.REACT_APP_API_URL;

export async function apiCall(endpoint, method, data = null, isFileUpload = false, additionalHeaders = {}) {
  let url = `${API_URL}${endpoint}`;
  let options = {
    method,
    headers: {
      ...additionalHeaders, // 包含從 authApi 傳過來的標頭
    },
  };

  if (method === 'GET' && data) {
    const params = new URLSearchParams(data);
    url += `?${params.toString()}`;
  } else if (isFileUpload) {
    options.body = data;  // data should be FormData
  } else if (data) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // 處理 404 和 500 錯誤
      if (response.status === 404 || response.status === 500) {
        triggerErrorPage(response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 處理其他錯誤
      const errorData = await response.json();
      throw new Error(errorData.message || 'API call failed');
    }

    // 對於成功的請求，根據方法返回適當的結果
    return method === 'DELETE' ? response : response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error; // 重新拋出錯誤，以便調用者可以進行進一步處理
  }
}