// src/api/logoutApi.js
export const logout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/logout`, {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // 允许发送和接收cookie
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  