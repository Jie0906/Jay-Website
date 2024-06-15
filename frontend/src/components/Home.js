// src/components/Home.js
import React from 'react';
import styled from 'styled-components';
import Profile from './Profile'; // 引用 Profile 组件
import Footer from './Footer'; // 引用 Footer 组件
import { useInView } from 'react-intersection-observer';

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
  const { ref: footerRef, inView: footerInView } = useInView({ triggerOnce: true });

  return (
    <HomeContainer>
      <Profile />
      <FooterContainer ref={footerRef} inView={footerInView}>
        <Footer />
      </FooterContainer>
    </HomeContainer>
  );
};

const FooterContainer = styled.div`
  opacity: ${({ inView }) => (inView ? 1 : 0)};
  transform: ${({ inView }) => (inView ? 'none' : 'translateY(100px)')};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

export default Home;
