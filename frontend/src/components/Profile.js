import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background:   
    radial-gradient(circle, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%),
    url('/assets/adavator.jpeg') no-repeat center center;
  background-size: cover;
  position: relative;
  overflow: hidden;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
  padding: 40px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 1.5s ease-out;
`;

const ProfileName = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  animation: ${slideUp} 1s ease-out 0.5s both;
`;

const Subtitle = styled.div`
  font-size: 1.4rem;
  margin-bottom: 30px;
  animation: ${slideUp} 1s ease-out 1s both;
`;

const Motto = styled.div`
  font-size: 1.6rem;
  font-style: italic;
  color: #FFC300;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.4;
  animation: ${slideUp} 1s ease-out 1.5s both;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  animation: ${slideUp} 1s ease-out 2s both;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.8rem;
  transition: all 0.3s ease;

  &:hover {
    color: #FFC300;
    transform: translateY(-5px);
  }
`;

const Profile = () => {
  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileName>Jay Li</ProfileName>
        <Subtitle>Engineer by Profession | Coder by Passion</Subtitle>
        <Motto>
          "If you are doing your best, you will not have to worry about failure."
        </Motto>
        <SocialLinks>
          <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </SocialIcon>
          <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </SocialIcon>
          <SocialIcon href="mailto:your.email@example.com">
            <FaEnvelope />
          </SocialIcon>
        </SocialLinks>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;