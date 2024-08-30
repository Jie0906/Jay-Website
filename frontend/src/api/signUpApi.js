// src/api/signUpApi.js
export const signUp = async (name, username, email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/signUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, email, password })
      });
  
      if (!response.ok) {
        throw new Error('Sign up failed');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  