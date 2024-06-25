// src/components/AboutMe.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAboutMe } from '../api/aboutMeApi'

const TimelineItem = ({ date, text, image }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <StyledTimelineItem ref={ref} inView={inView}>
      <TimelineContent>
        <TimelineDate>{date}</TimelineDate>
        <TimelineText>{text}</TimelineText>
        <TimelineImage src={image} alt={date} />
      </TimelineContent>
    </StyledTimelineItem>
  );
};

const About = () => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <AboutContainer>
      <Timeline>
        {aboutMeContent.map((item) => (
          <TimelineItem
            key={item._id}
            date={item.date}
            text={item.content}
            image={item.image}
          />
        ))}
      </Timeline>
    </AboutContainer>
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

const StyledTimelineItem = styled.div`
  padding: 20px 30px;
  position: relative;
  background-color: inherit;
  width: 50%;
  opacity: ${({ inView }) => (inView ? 1 : 0)};
  transform: ${({ inView }) => (inView ? 'none' : 'translateY(100px)')};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
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

const TimelineDate = styled.h3`
  margin: 0;
  color: #8b5e3c;
`;

const TimelineText = styled.p`
  color: #7a5533;
`;

const TimelineImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  position: absolute;
  top: 20px;
  right: -130px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  &:nth-child(even) {
    left: -130px;
    right: auto;
  }
`;

export default About;
