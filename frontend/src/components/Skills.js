import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAllSkills } from '../api/skillApi';
import Loading from '../components/common/Loading';

// 添加 Google Fonts
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&display=swap');
`;

const Skill = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  if (loading && skills.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <GlobalStyle />
      <SkillContainer>
        <SkillHeader>
          <HeaderTitle>技能專長</HeaderTitle>
          <HeaderUnderline />
        </SkillHeader>
        <SkillList>
          {skills.map((skill, index) => (
            <SkillItem key={skill._id} skill={skill} index={index} />
          ))}
        </SkillList>
      </SkillContainer>
    </>
  );
};

const SkillItem = ({ skill, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <StyledSkillItem ref={ref} inView={inView} index={index}>
      {skill.imageUrl && (
        <SkillImageWrapper>
          <SkillImage src={skill.imageUrl} alt={skill.title} />
        </SkillImageWrapper>
      )}
      <SkillContent>
        <SkillTitle>{skill.title}</SkillTitle>
        <SkillSubtitle>{skill.subtitle}</SkillSubtitle>
        <SkillDescription dangerouslySetInnerHTML={{ __html: skill.content }} />
      </SkillContent>
    </StyledSkillItem>
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
const SkillContainer = styled.div`
  padding: 50px 0;
  background-color: #f5e5d3;
  width: 100%;
`;

const SkillHeader = styled.div`
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

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
`;

const StyledSkillItem = styled.div`
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

const SkillImageWrapper = styled.div`
  flex: 0 0 300px;
  height: 300px;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex: 0 0 250px;
    height: 250px;
  }

  @media (max-width: 768px) {
    flex: none;
    height: 200px;
  }
`;

const SkillImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${StyledSkillItem}:hover & {
    transform: scale(1.05);
  }
`;

const SkillContent = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SkillTitle = styled.h3`
  color: #6b4226;
  margin: 0 0 15px 0;
  font-size: 1.8rem;
`;

const SkillSubtitle = styled.h4`
  color: #8b5a2b;
  font-size: 1.2rem;
  margin: 0 0 15px 0;
`;

const SkillDescription = styled.div`
  color: #4a3520;
  font-size: 1.1rem;
  line-height: 1.6;
`;

export default Skill;