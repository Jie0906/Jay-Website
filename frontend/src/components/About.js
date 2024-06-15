// src/components/AboutMe.js
import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

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

const TimelineItem = styled.div`
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

const About = () => {
  const { ref: firstRef, inView: firstInView } = useInView({ triggerOnce: true });
  const { ref: secondRef, inView: secondInView } = useInView({ triggerOnce: true });
  const { ref: thirdRef, inView: thirdInView } = useInView({ triggerOnce: true });
  const { ref: fourthRef, inView: fourthInView } = useInView({ triggerOnce: true });
  const { ref: fifthRef, inView: fifthInView } = useInView({ triggerOnce: true });

  return (
    <AboutContainer>
      <Timeline>
        <TimelineItem ref={firstRef} inView={firstInView}>
          <TimelineContent>
            <TimelineDate>2013</TimelineDate>
            <TimelineText>Started my journey...</TimelineText>
            <TimelineImage src="/assets/photo1.jpg" alt="2013" />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem ref={secondRef} inView={secondInView}>
          <TimelineContent>
            <TimelineDate>2016</TimelineDate>
            <TimelineText>Continued my studies...</TimelineText>
            <TimelineImage src="/assets/photo2.jpg" alt="2016" />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem ref={thirdRef} inView={thirdInView}>
          <TimelineContent>
            <TimelineDate>2020</TimelineDate>
            <TimelineText>Graduated and started working...</TimelineText>
            <TimelineImage src="/assets/photo3.jpg" alt="2020" />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem ref={fourthRef} inView={fourthInView}>
          <TimelineContent>
            <TimelineDate>2024</TimelineDate>
            <TimelineText>Looking forward to new opportunities...</TimelineText>
            <TimelineImage src="/assets/photo4.jpg" alt="2024" />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem ref={fifthRef} inView={fifthInView}>
          <TimelineContent>
            <TimelineDate>Future</TimelineDate>
            <TimelineText>Excited about the future...</TimelineText>
            <TimelineImage src="/assets/photo5.jpg" alt="Future" />
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </AboutContainer>
  );
};

export default About;
