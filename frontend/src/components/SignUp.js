// src/components/SignUp.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { signUp } from '../api/signUpApi';  // 引用 signUp 函数

const SignUpContainer = styled.div`
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

const SignUpForm = styled.form`
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

const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const data = await signUp(name, username, email, password);
      console.log(data);
      // 处理注册成功的逻辑，例如显示成功消息或重定向到登录页面
      alert(`User ${name} created successfully!`);
      window.location.href = '/login';
    } catch (err) {
      setError('Sign up failed. Please check your input.');
    }
  };

  return (
    <SignUpContainer>
      <Overlay />
      <SignUpForm onSubmit={handleSignUp}>
        <FormTitle>Sign Up</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormInput
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormButton type="submit">Sign Up</FormButton>
      </SignUpForm>
    </SignUpContainer>
  );
};

export default SignUp;
