import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HomeContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 50px;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 95%;
  height: 95%;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 1s ease-out;
`;

const LeftSection = styled.div`
  flex: 2;
  background-color: #f0f0f0;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const RightSection = styled.div`
  flex: 3;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProfileImageWrapper = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Name = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const SocialIcon = styled.a`
  color: #333;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #0066cc;
  }
`;

const Greeting = styled.h2`
  font-size: 3.5rem;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.a`
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
`;

const ResumeButton = styled(Button)`
  background-color: #0066cc;
  color: white;

  &:hover {
    background-color: #0052a3;
  }
`;

const ProjectsButton = styled(Button)`
  background-color: white;
  color: #0066cc;
  border: 2px solid #0066cc;

  &:hover {
    background-color: #0066cc;
    color: white;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 30px;
`;

const Profile = () => {
  return (
    <HomeContainer>
      <ContentWrapper>
        <LeftSection>
          <div>
            <ProfileImageWrapper>
              <ProfileImage src="../../public/asseta/adavator.JPG" alt="Jay Li" />
            </ProfileImageWrapper>
            <Name>Jay Li</Name>
            <Title>Project Manager</Title>
          </div>
          <SocialLinks>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer"><FaFacebookF /></SocialIcon>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></SocialIcon>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></SocialIcon>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></SocialIcon>
          </SocialLinks>
        </LeftSection>
        <RightSection>
          <Greeting>Hello</Greeting>
          <Subtitle>Here's who I am & what I do</Subtitle>
          <ButtonGroup>
            <ResumeButton href="#">RESUME</ResumeButton>
            <ProjectsButton href="#">PROJECTS</ProjectsButton>
          </ButtonGroup>
          <Description>
            I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click "Edit Text" or double click me to add your own content and make changes to the font.
          </Description>
          <Description>
            I'm a great place for you to tell a story and let your users know a little more about you.
          </Description>
        </RightSection>
      </ContentWrapper>
    </HomeContainer>
  );
};

export default Profile;