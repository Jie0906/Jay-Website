// src/layouts/PublicLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: var(--navbar-height, 60px);
`;

const PublicLayout = () => {
  return (
    <LayoutContainer>
      <ContentWrapper>
        <Navbar />
        <MainContent>
          <Outlet />
        </MainContent>
        <Footer />
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default PublicLayout;