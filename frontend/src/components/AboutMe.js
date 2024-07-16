import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getAboutMe } from '../api/aboutMeApi';
import { useInView } from 'react-intersection-observer';

const AboutMe = () => {
  const [aboutMeContent, setAboutMeContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const data = await getAboutMe();
        console.log(data); // 檢查返回的數據結構
        setAboutMeContent(data); // 確保使用正確的數據路徑
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <AboutContainer>
      <Timeline>
        {aboutMeContent.map((item, index) => (
          <TimelineItem
            key={item._id}
            date={item.date}
            subtitle={item.subtitle}
            content={item.content}
            fileUrl={item.imageUrl} // 使用從後端返回的 imageUrl
            isLeft={index % 2 === 0}
          />
        ))}
      </Timeline>
    </AboutContainer>
  );
};

const TimelineItem = ({ date, subtitle, content, fileUrl, isLeft }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <StyledTimelineItem ref={ref} inView={inView} isLeft={isLeft}>
      <TimelineContent isLeft={isLeft}>
        <TimelineSubtitle>{subtitle}</TimelineSubtitle>
        <TimelineText>{content}</TimelineText>
        <TimelineDate>{new Date(date).toLocaleDateString()}</TimelineDate>
      </TimelineContent>
      <TimelineImage src={fileUrl} alt={subtitle} isLeft={isLeft} />
    </StyledTimelineItem>
  );
};

const AboutContainer = styled.div`
  padding: 50px;
  background-color: #fef5e7;
`;

const Timeline = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  &:before {
    content: '';
    position: absolute;
    width: 6px;
    background-color: #d48c2e;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -3px;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledTimelineItem = styled.div`
  padding: 20px 30px;
  position: relative;
  background-color: inherit;
  width: 50%;
  opacity: ${({ inView }) => (inView ? 1 : 0)};
  transform: ${({ inView }) => (inView ? 'none' : 'translateY(100px)')};
  animation: ${({ inView }) => (inView ? slideIn : 'none')} 0.6s ease-out;
  &:nth-child(odd) {
    left: 0;
  }
  &:nth-child(even) {
    left: 50%;
  }
`;

const TimelineContent = styled.div`
  padding: 20px 30px;
  background-color: #fffaf0;
  position: relative;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  &:after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    right: -17px;
    background-color: #d48c2e;
    border: 4px solid #fffaf0;
    top: 15px;
    border-radius: 50%;
    z-index: 1;
  }
  &:nth-child(even):after {
    left: -17px;
    right: auto;
  }
`;

const TimelineSubtitle = styled.h4`
  margin: 0;
  color: #8b5e3c;
`;

const TimelineText = styled.p`
  margin: 10px 0;
  color: #7a5533;
`;

const TimelineDate = styled.p`
  position: absolute;
  bottom: 10px;
  right: 20px;
  margin: 0;
  color: #7a5533;
`;

const TimelineImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  ${({ isLeft }) => (isLeft ? 'right: -130px;' : 'left: -130px;')}
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export default AboutMe;
