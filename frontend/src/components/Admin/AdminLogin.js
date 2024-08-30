import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/loginApi'; // 引用 login 函数

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background: url('/assets/background.jpeg') no-repeat center center; /* 背景图片 */
  background-size: cover;
  height: calc(100vh - 80px);
  position: relative;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 250, 240, 0.6); /* 半透明背景 */
  z-index: 1;
`;

const LoginForm = styled.form`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #fffaf0;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  color: #8b5e3c;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #d48c2e;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b37524;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: -10px;
  margin-bottom: 20px;
`;

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldNavigate) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [shouldNavigate, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // 清除之前的错误信息
    try {
      const data = await login(username, password);
      console.log('Login response:', data);

      // 检查 cookie 是否被设置
      console.log('Cookies:', document.cookie);

      if (data && data.message && data.message.includes('successfully')) {
        console.log('Login successful, navigating to dashboard...');
        setShouldNavigate(true);
      } else {
        console.log('Login failed, setting error message');
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <LoginContainer>
      <Overlay />
      <LoginForm onSubmit={handleLogin}>
        <FormTitle>Admin Login</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormButton type="submit">Login</FormButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default AdminLogin;
