// src/api/loginApi.js
export const login = async (username, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // 这确保了 cookie 被发送和接收
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login API response:', data);
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};