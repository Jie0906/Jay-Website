// api/common.js
export const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/status`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      return await response.json();
    } catch (error) {
      console.error('Auth check failed:', error);
      throw error;
    }
  };
  
  // 可以在这里添加其他通用的 API 函数