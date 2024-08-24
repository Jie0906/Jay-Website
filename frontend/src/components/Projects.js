import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAllProjects } from '../api/projectApi';
import Loading from '../components/common/Loading';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&display=swap');
`;

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading && projects.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <GlobalStyle />
      <ProjectContainer>
        <ProjectHeader>
          <HeaderTitle>作品集</HeaderTitle>
          <HeaderUnderline />
        </ProjectHeader>
        <ProjectList>
          {projects.map((project, index) => (
            <ProjectItem key={project._id} project={project} index={index} />
          ))}
        </ProjectList>
      </ProjectContainer>
    </>
  );
};

const ProjectItem = ({ project, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <StyledProjectItem ref={ref} inView={inView} index={index}>
      <ProjectImageWrapper>
        <ProjectImage src={project.imageUrl || '/placeholder-image.jpg'} alt={project.title} />
      </ProjectImageWrapper>
      <ProjectContent>
        <ProjectTitle>{project.title || 'Untitled Project'}</ProjectTitle>
        <ProjectDate>{project.date ? new Date(project.date).toLocaleDateString() : 'No date'}</ProjectDate>
        <ProjectDescription dangerouslySetInnerHTML={{ __html: project.content }} />
      </ProjectContent>
    </StyledProjectItem>
  );
};

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const expandWidth = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100px;
  }
`;

// Styled components
const ProjectContainer = styled.div`
  padding: 50px 0;
  background-color: #f5e5d3;
  width: 100%;
`;

const ProjectHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  color: #4a3520;
  font-size: 3rem;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  margin-bottom: 10px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const HeaderUnderline = styled.div`
  height: 3px;
  background-color: #8b5e3c;
  animation: ${expandWidth} 0.8s ease-out forwards;
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
`;

const StyledProjectItem = styled.div`
  display: flex;
  background-color: #fffaf0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${props => props.index * 0.1}s;
  width: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProjectImageWrapper = styled.div`
  flex: 0 0 350px;
  height: 350px;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex: 0 0 300px;
    height: 300px;
  }

  @media (max-width: 768px) {
    flex: none;
    height: 250px;
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${StyledProjectItem}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectContent = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProjectTitle = styled.h3`
  color: #6b4226;
  margin: 0 0 15px 0;
  font-size: 1.8rem;
`;

const ProjectDate = styled.p`
  color: #8b5a2b;
  font-size: 1rem;
  margin: 0 0 15px 0;
`;

const ProjectDescription = styled.div`
  color: #4a3520;
  font-size: 1.1rem;
  line-height: 1.6;
`;

export default Project;