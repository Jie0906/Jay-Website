import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAboutMe } from '../api/aboutMeApi';
import Loading from '../components/common/Loading';
import TimelineItem from '../components/common/TimelineItem';

// 添加 Google Fonts
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&display=swap');
`;

const AboutMe = () => {
  const [aboutMeContent, setAboutMeContent] = useState({
    autobiography: [],
    education: [],
    experience: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAboutMe = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAboutMe();
      setAboutMeContent(data);
    } catch (error) {
      console.error('Failed to fetch about me data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutMe();
  }, [fetchAboutMe]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <GlobalStyle />
      <AboutMeContainer>
        {renderSection('自傳', aboutMeContent.autobiography, AutobiographyItem)}
        {renderSection('學歷', aboutMeContent.education, EducationItem, true)}
        {renderSection('經驗', aboutMeContent.experience, ExperienceItem)}
      </AboutMeContainer>
    </>
  );
};

const renderSection = (title, items, ItemComponent, isTimeline = false) => (
  <Section>
    <SectionHeader>
      <SectionTitle>{title}</SectionTitle>
      <HeaderUnderline />
    </SectionHeader>
    {isTimeline ? (
      <Timeline>
        {items.map((item, index) => (
          <ItemComponent key={item._id} item={item} index={index} isLeft={index % 2 === 0} />
        ))}
      </Timeline>
    ) : (
      <ItemList>
        {items.map((item, index) => (
          <ItemComponent key={item._id} item={item} index={index} />
        ))}
      </ItemList>
    )}
  </Section>
);

const AutobiographyItem = ({ item, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <StyledItem ref={ref} inView={inView} index={index}>
      <ItemContent>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemDescription dangerouslySetInnerHTML={{ __html: item.content }} />
      </ItemContent>
    </StyledItem>
  );
};

const EducationItem = ({ item, index, isLeft }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <TimelineItem
      ref={ref}
      inView={inView}
      index={index}
      isLeft={isLeft}
      {...item}
      isAdminMode={false} // 在普通模式下设置为 false
    />
  );
};


const ExperienceItem = ({ item, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <StyledItem ref={ref} inView={inView} index={index}>
      {item.imageUrl && (
        <ItemImageWrapper>
          <ItemImage src={item.imageUrl} alt={item.title} />
        </ItemImageWrapper>
      )}
      <ItemContent>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemSubtitle>{item.subtitle}</ItemSubtitle>
        <ItemDescription dangerouslySetInnerHTML={{ __html: item.content }} />
      </ItemContent>
    </StyledItem>
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
const AboutMeContainer = styled.div`
  padding: 50px 0;
  background-color: #f5e5d3;
  min-height: 100vh;
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

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch; // 改为 stretch
  gap: 30px;
  width: 100%; // 确保全宽
`;

const Timeline = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;

  &:before {
    content: '';
    position: absolute;
    width: 4px;
    background-color: #d48c2e;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -2px;
  }
`;

const StyledItem = styled.div`
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
  width: 100%; // 移除 max-width

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;


const TimelineContent = styled.div`
  padding: 20px;
  background-color: #fffaf0;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 20px;
    ${props => props.isLeft ? 'right: -36px;' : 'left: -36px;'}
    width: 20px;
    height: 20px;
    background-color: #d48c2e;
    border: 4px solid #fffaf0;
    border-radius: 50%;
  }
`;

const ItemImageWrapper = styled.div`
  flex: 0 0 200px;
  height: 200px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${StyledItem}:hover & {
    transform: scale(1.05);
  }
`;

const ItemContent = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ItemTitle = styled.h3`
  color: #6b4226;
  margin: 0 0 10px 0;
  font-size: 1.5rem;
`;

const ItemSubtitle = styled.h4`
  color: #8b5a2b;
  font-size: 1.1rem;
  margin: 0 0 10px 0;
`;

const ItemDescription = styled.div`
  color: #4a3520;
  font-size: 1rem;
  line-height: 1.6;
`;

const TimelineDate = styled.p`
  color: #8b5a2b;
  font-size: 0.9rem;
  margin-top: 10px;
`;

export default AboutMe;