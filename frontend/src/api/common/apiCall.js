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

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API call failed');
  }

  return method === 'DELETE' ? response : response.json();
}