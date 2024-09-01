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
  const [skillContent, setSkillContent] = useState({
    technical: [],
    certification: []
  });
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSkills();
      // 根據 type 分類技能
      const technical = data.filter(skill => skill.type === 'technical');
      const certification = data.filter(skill => skill.type === 'certification');
      setSkillContent({ technical, certification });
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <GlobalStyle />
      <SkillContainer>
        {renderSection('技術技能', skillContent.technical)}
        {renderSection('專業證照', skillContent.certification)}
      </SkillContainer>
    </>
  );
};

const renderSection = (title, items = []) => (
  <Section>
    <SectionHeader>
      <SectionTitle>{title}</SectionTitle>
      <HeaderUnderline />
    </SectionHeader>
    <SkillGrid>
      {items.map((item, index) => (
        <SkillItem key={item._id} item={item} index={index} />
      ))}
    </SkillGrid>
  </Section>
);

const SkillItem = ({ item, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <StyledSkillItem ref={ref} inView={inView} index={index}>
      <SkillContent>
        <SkillTitle>{item.title}</SkillTitle>
        <SkillSubtitle>{item.subtitle}</SkillSubtitle>
        <SkillDescription dangerouslySetInnerHTML={{ __html: item.content }} />
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

const Section = styled.div`
  margin-bottom: 50px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled.h2`
  color: #4a3520;
  font-size: 2.5rem;
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

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSkillItem = styled.div`
  background-color: #fffaf0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${props => props.index * 0.1}s;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SkillContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SkillTitle = styled.h3`
  color: #6b4226;
  margin: 0 0 10px 0;
  font-size: 1.4rem;
`;

const SkillSubtitle = styled.h4`
  color: #8b5a2b;
  font-size: 1.1rem;
  margin: 0 0 10px 0;
`;

const SkillDescription = styled.div`
  color: #4a3520;
  font-size: 1rem;
  line-height: 1.5;
  flex-grow: 1;
  overflow: auto;
`;

export default Skill;