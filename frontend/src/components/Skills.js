// src/components/Skills.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAllSkills } from '../api/skillApi';

const SkillSection = ({ skill }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <SkillItem ref={ref} style={{ opacity: inView ? 1 : 0.5, transform: inView ? 'scale(1)' : 'scale(0.9)' }}>
      <SkillDetails>
        <SkillTitle>{skill.title}</SkillTitle>
        <SkillSubtitle>{skill.subtitle}</SkillSubtitle>
        <SkillDescription>{skill.content}</SkillDescription>
      </SkillDetails>
      {skill.image && (
        <SkillImageWrapper>
          <SkillImage src={skill.image} alt={skill.title} />
        </SkillImageWrapper>
      )}
    </SkillItem>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAllSkills();
        setSkills(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <SkillsContainer>
      {skills.map((skill) => (
        <SkillSection key={skill._id} skill={skill} />
      ))}
    </SkillsContainer>
  );
};

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  background-color: #fef5e7;
  min-height: 100vh;
  box-sizing: border-box;
`;

const SkillItem = styled.div`
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
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

const SkillDetails = styled.div`
  flex: 1;
`;

const SkillTitle = styled.h2`
  margin: 0;
  color: #8b5e3c;
`;

const SkillSubtitle = styled.h3`
  font-size: 1.2em;
  margin-bottom: 10px;
  color: grey;
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


export default Skills;
