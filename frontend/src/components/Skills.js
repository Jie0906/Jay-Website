// src/components/Skills.js
import React from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: #fef5e7;
  min-height: 100vh;
  box-sizing: border-box;
`;

const SkillSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
  padding: 20px;
  background-color: #fffaf0;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: ${({ inView }) => (inView ? 1 : 0)};
  transform: ${({ inView }) => (inView ? 'scale(1)' : 'scale(0.9)')};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

const SkillDetails = styled.div`
  flex: 1;
`;

const SkillTitle = styled.h2`
  margin: 0;
  color: #8b5e3c;
`;

const SkillDescription = styled.p`
  color: #7a5533;
`;

const SkillImageWrapper = styled.div`
  flex: 0 0 200px;
  height: 200px;
  margin-left: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SkillImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Skills = () => {
  const { ref: backendRef, inView: backendInView } = useInView({ triggerOnce: true });
  const { ref: mlRef, inView: mlInView } = useInView({ triggerOnce: true });

  return (
    <SkillsContainer>
      <SkillSection ref={backendRef} inView={backendInView}>
        <SkillDetails>
          <SkillTitle>Backend</SkillTitle>
          <SkillDescription>
            Experience with Node.js, Express, and database management with MongoDB and SQL.
          </SkillDescription>
          <SkillDescription>
            Proficient in developing RESTful APIs and managing user authentication.
          </SkillDescription>
        </SkillDetails>
        <SkillImageWrapper>
          <SkillImage src="/assets/backend.jpg" alt="Backend" />
        </SkillImageWrapper>
      </SkillSection>
      <SkillSection ref={mlRef} inView={mlInView}>
        <SkillDetails>
          <SkillTitle>Machine Learning</SkillTitle>
          <SkillDescription>
            Knowledge of machine learning algorithms and hands-on experience with TensorFlow and Keras.
          </SkillDescription>
          <SkillDescription>
            Experience in developing and deploying machine learning models.
          </SkillDescription>
        </SkillDetails>
        <SkillImageWrapper>
          <SkillImage src="/assets/machine_learning.jpg" alt="Machine Learning" />
        </SkillImageWrapper>
      </SkillSection>
    </SkillsContainer>
  );
};

export default Skills;
