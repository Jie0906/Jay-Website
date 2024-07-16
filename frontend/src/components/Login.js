// src/components/Login.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { login } from '../api/loginApi';  // 引用 login 函数

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

const SignUpLink = styled.div`
  margin-top: 20px;
  font-size: 0.9rem;
  color: #7a5533;

  a {
    color: #d48c2e;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: #b37524;
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      console.log(data);
      // 处理登录成功的逻辑，例如保存token和sessionId到localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('sessionId', data.sessionId);
      localStorage.setItem('username', username); // 保存用户名
      // 重定向到主页或其他页面
      window.location.href = '/';
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <LoginContainer>
      <Overlay />
      <LoginForm onSubmit={handleLogin}>
        <FormTitle>Login</FormTitle>
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
        <SignUpLink>
          Did not have account? <Link to="/signup">Here to sign up</Link>
        </SignUpLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
