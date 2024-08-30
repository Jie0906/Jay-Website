import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaCode, FaBlog, FaProjectDiagram, FaSignOutAlt } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: #fef5e7;
  min-height: 100vh;
  box-sizing: border-box;
  animation: ${fadeIn} 0.5s ease-out;
`;

const DashboardTitle = styled.h1`
  margin-bottom: 40px;
  color: #8b5e3c;
  font-size: 2.5rem;
  text-align: center;
  animation: ${slideIn} 0.5s ease-out;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
`;

const DashboardButton = styled.button`
  width: 100%;
  padding: 20px;
  background-color: #d48c2e;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.5s ease-out;
  animation-fill-mode: both;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }

  &:hover {
    background-color: #b37524;
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  svg {
    margin-right: 10px;
    font-size: 1.4rem;
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  padding: 15px 30px;
  background-color: #8b5e3c;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.5s ease-out 0.5s;
  animation-fill-mode: both;

  &:hover {
    background-color: #7a5533;
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  svg {
    margin-right: 10px;
  }
`;

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/admin/login');
  };

  return (
    <DashboardContainer>
      <DashboardTitle>Jay Website 控制台</DashboardTitle>
      <ButtonContainer>
        <DashboardButton onClick={() => navigate('/admin/aboutMe')}>
          <FaUser />
          About Me
        </DashboardButton>
        <DashboardButton onClick={() => navigate('/admin/skill')}>
          <FaCode />
          Skills
        </DashboardButton>
        <DashboardButton onClick={() => navigate('/admin/blog')}>
          <FaBlog />
          Blog
        </DashboardButton>
        <DashboardButton onClick={() => navigate('/admin/project')}>
          <FaProjectDiagram />
          Projects
        </DashboardButton>
      </ButtonContainer>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </LogoutButton>
    </DashboardContainer>
  );
};

export default AdminDashboard;