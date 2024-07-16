// src/components/Profile.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

// 定义动画
const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background: url('/assets/adavator.jpeg') no-repeat center center; /* 头像图片作为背景 */
  background-size: cover;
  height: 100vh; /* 高度设置为 100vh 以充满整个视窗高度 */
  width: 100vw; /* 宽度设置为 100vw 以充满整个视窗宽度 */
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

const ProfileContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
  padding: 20px;
`;

const ProfileName = styled.h1`
  margin: 10px 0;
  font-size: 3rem;
  font-weight: bold;
  color: white;
  animation: ${slideIn} 2s ease-out forwards;
`;

const Subtitle = styled.div`
  margin-top: 5px;
  font-size: 1.2rem;
  color: white;
  opacity: 0;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 2s; /* 在 ProfileName 动画结束后开始 */
`;

const Motto = styled.div`
  margin-top: 10px;
  font-size: 1.5rem;
  color: #EAC100;
  text-shadow: 
    -1px -1px 0 #ffffff,  
     1px -1px 0 #ffffff,
    -1px  1px 0 #ffffff,
     1px  1px 0 #ffffff; /* 添加白色外框 */
  opacity: 0;
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 3s; /* 在 Subtitle 动画结束后开始 */
`;

const Profile = () => {
  return (
    <ProfileContainer>
      <Overlay />
      <ProfileContent>
        <ProfileName>Jay Li Perosonal Website</ProfileName>
        <Subtitle>Engineer by Profession | Coder by Passion</Subtitle>
        <Motto>“If you are doing your best, you will not have to worry about failure.”</Motto>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
