// src/layouts/PublicLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent>
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding-top: var(--navbar-height, 60px);
  background-color: #FFF9F4;
`;

//調整左右寬度
const PageWrapper = styled.div`
  max-width: 1800px; 
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;



export default PublicLayout;