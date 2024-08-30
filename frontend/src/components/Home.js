// src/components/Home.js
import React from 'react';
import styled from 'styled-components';
import Profile from './Profile';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  text-align: center;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Profile />
    </HomeContainer>
  );
};

export default Home;