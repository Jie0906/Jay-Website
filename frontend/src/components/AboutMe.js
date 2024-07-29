import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getAboutMe } from '../api/aboutMeApi';
import { useInView } from 'react-intersection-observer';
import Loading from '../components/common/Loading';

const AboutMe = () => {
  const [aboutMeContent, setAboutMeContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const data = await getAboutMe();
        setAboutMeContent(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

  return (
    <AboutContainer>
      <BackgroundCircle1 />
      <BackgroundCircle2 />
      <ContentWrapper>
        <Title>我的經歷</Title>
        <TimelineWrapper>
          {aboutMeContent.map((item, index) => (
            <TimelineItem
              key={item._id}
              date={item.date}
              subtitle={item.subtitle}
              content={item.content}
              fileUrl={item.imageUrl}
              isLeft={index % 2 === 0}
            />
          ))}
        </TimelineWrapper>
      </ContentWrapper>
    </AboutContainer>
  );
};

const TimelineItem = ({ date, subtitle, content, fileUrl, isLeft }) => {
  const { ref, inView } = useInView({ 
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <StyledTimelineItem ref={ref} inView={inView} isLeft={isLeft}>
      <TimelineDot />
      <TimelineContent isLeft={isLeft}>
        <TimelineImage src={fileUrl} alt={subtitle} />
        <TextContent>
          <TimelineDate>{new Date(date).toLocaleDateString()}</TimelineDate>
          <TimelineSubtitle>{subtitle}</TimelineSubtitle>
          <TimelineText>{content}</TimelineText>
        </TextContent>
      </TimelineContent>
    </StyledTimelineItem>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateX(${props => props.isLeft ? '-50px' : '50px'});
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
`;

const AboutContainer = styled.div`
  padding: 50px 20px;
  background: linear-gradient(135deg, #fef5e7 0%, #ffd79a 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundCircle1 = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background-color: rgba(212, 140, 46, 0.1);
  top: -250px;
  left: -250px;
`;

const BackgroundCircle2 = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background-color: rgba(139, 94, 60, 0.1);
  bottom: -200px;
  right: -200px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  text-align: center;
  color: #8b5e3c;
  font-size: 2.5rem;
  margin-bottom: 50px;
  animation: ${fadeIn} 1s ease-out;
`;

const TimelineWrapper = styled.div`
  position: relative;
  padding: 40px 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    background-color: #d48c2e;
    transform: translateX(-50%);
  }
`;

const StyledTimelineItem = styled.div`
  display: flex;
  justify-content: ${props => props.isLeft ? 'flex-start' : 'flex-end'};
  padding-bottom: 50px;
  width: 100%;
  opacity: ${props => props.inView ? 1 : 0};
  animation: ${props => props.inView ? slideIn : 'none'} 0.6s ease-out;
`;

const TimelineDot = styled.div`
  position: absolute;
  left: 50%;
  width: 20px;
  height: 20px;
  background-color: #d48c2e;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const TimelineContent = styled.div`
  width: 45%;
  padding: 20px;
  background-color: rgba(255, 250, 240, 0.8);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isLeft ? 'flex-start' : 'flex-end'};
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TimelineImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const TextContent = styled.div`
  width: 100%;
`;

const TimelineDate = styled.p`
  font-size: 0.9rem;
  color: #d48c2e;
  margin-bottom: 5px;
`;

const TimelineSubtitle = styled.h3`
  color: #8b5e3c;
  margin-bottom: 10px;
`;

const TimelineText = styled.p`
  color: #7a5533;
  line-height: 1.6;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 20px;
`;

export default AboutMe;