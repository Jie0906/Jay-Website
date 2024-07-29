import React from 'react';
import styled, { keyframes } from 'styled-components';

// 左右跳動的動畫
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const LoadingText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  color: #d48c2e;
  animation: ${bounce} 1s infinite;
  z-index: 2;
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 250, 240, 0.8); /* 淡化背景 */
  z-index: 1;
`;

const Loading = () => (
  <LoadingContainer>
    <LoadingText>Loading...</LoadingText>
  </LoadingContainer>
);

export default Loading;
