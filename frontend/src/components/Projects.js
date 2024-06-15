// src/components/Projects.js
import React from 'react';
import styled from 'styled-components';
import { FaHeart, FaShareAlt, FaComment } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: #fef5e7;
  min-height: 100vh;
  box-sizing: border-box;
`;

const ProjectItem = styled.div`
  background-color: #fffaf0;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
  opacity: ${({ inView }) => (inView ? 1 : 0)};
  transform: ${({ inView }) => (inView ? 'none' : 'translateY(100px)')};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectTitle = styled.h3`
  margin: 0;
  color: #8b5e3c;
`;

const ProjectDate = styled.span`
  color: #7a5533;
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #7a5533;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #d48c2e;
  }
`;

const Projects = () => {
  const { ref: firstRef, inView: firstInView } = useInView({ triggerOnce: true });
  const { ref: secondRef, inView: secondInView } = useInView({ triggerOnce: true });

  return (
    <ProjectsContainer>
      <ProjectItem ref={firstRef} inView={firstInView}>
        <ProjectHeader>
          <ProjectTitle>Project 1</ProjectTitle>
          <ProjectDate>2024/05/13</ProjectDate>
        </ProjectHeader>
        <ProjectFooter>
          <IconButton><FaHeart /></IconButton>
          <IconButton><FaShareAlt /></IconButton>
          <IconButton><FaComment /></IconButton>
        </ProjectFooter>
      </ProjectItem>
      <ProjectItem ref={secondRef} inView={secondInView}>
        <ProjectHeader>
          <ProjectTitle>Project 2</ProjectTitle>
          <ProjectDate>2024/04/30</ProjectDate>
        </ProjectHeader>
        <ProjectFooter>
          <IconButton><FaHeart /></IconButton>
          <IconButton><FaShareAlt /></IconButton>
          <IconButton><FaComment /></IconButton>
        </ProjectFooter>
      </ProjectItem>
    </ProjectsContainer>
  );
};

export default Projects;
