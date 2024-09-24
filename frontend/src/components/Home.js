import React from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { FaGithub } from 'react-icons/fa';
import { SiLine } from 'react-icons/si';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600&family=Dancing+Script:wght@400;700&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const HomeContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 60px);
  width: 100%;
  background: linear-gradient(to right, #e8ceb0 40%, #fff1e6 40%);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 10px 30px rgba(139, 69, 19, 0.1);
  border-radius: 15px;
  overflow: hidden;
  animation: ${fadeIn} 1s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 2;
  background: linear-gradient(45deg, #dbc09f, #e5c49d);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center; // 更改為 center，因為移除了 TagLine
  align-items: center;
  animation: ${slideInLeft} 1s ease-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const RightSection = styled.div`
  flex: 3;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${slideInRight} 1s ease-out;
  background: linear-gradient(135deg, #fff8dc, #faebd7);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImageWrapper = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  border: 5px solid #f5deb3;
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Name = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-align: center;
  color: #8b4513;
`;

const Title = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #a0522d;
  margin-bottom: 20px;
  text-align: center;
`;


const Greeting = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3.5rem;
  margin-bottom: 20px;
  color: #cd853f;
  text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.2);
`;

const Subtitle = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #8b4513;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.a`
  font-family: 'Poppins', sans-serif;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
`;

const ResumeButton = styled(Button)`
  background-color: #d2691e;
  color: white;

  &:hover {
    background-color: #8b4513;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
  }
`;

const ProjectsButton = styled(Button)`
  background-color: transparent;
  color: #d2691e;
  border: 2px solid #d2691e;

  &:hover {
    background-color: #d2691e;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
  }
`;

const Quote = styled.p`
  font-family: 'Dancing Script', cursive;
  font-size: 1.35rem;
  font-style: italic;
  line-height: 1.8;
  margin-top: 30px;
  color: #8b4513;
  text-align: center;
  font-weight: 700;
`;

const Description = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.3rem;
  line-height: 1.8;
  margin-top: 30px;
  color: #8b4513;
  text-align: center;
  font-weight: bold;
  padding: 15px;
  border-radius: 10px;
`;

const Home = () => {
  return (
    <>
      <GlobalStyle />
      <HomeContainer>
        <ContentWrapper>
          <LeftSection>
            <ProfileInfo>
              <ProfileImageWrapper>
                <ProfileImage src="/assets/adavator.JPG" alt="Jay Li" />
              </ProfileImageWrapper>
              <Name>Jay Li</Name>
              <Title>Software Engineer</Title>
            </ProfileInfo>
          </LeftSection>
          <RightSection>
            <Greeting>Hello</Greeting>
            <Subtitle>我是Jay，是一名軟體工程師，希望有一天能成為小時候心目中那個很厲害的人。</Subtitle>
            <ButtonGroup>
              <ResumeButton href="#">Resume</ResumeButton>
              <ProjectsButton href="#">Projects</ProjectsButton>
            </ButtonGroup>
            <Quote>
              "If you are doing your best, you will not have to worry about failure."
            </Quote>
            <Description>
              Engineer by Profession | Coder by Passion
            </Description>
          </RightSection>
        </ContentWrapper>
      </HomeContainer>
    </>
  );
};


export default Home;