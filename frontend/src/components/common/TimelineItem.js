// src/components/common/TimelineItem.js
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useInView } from 'react-intersection-observer';

const TimelineItem = ({ 
  id, 
  date, 
  title, 
  subtitle, 
  content, 
  imageUrl, 
  type, 
  isLeft, 
  onEdit, 
  onDelete, 
  onRestore,
  isDeleted,
  createdAt,
  updatedAt,
  deletedAt,
  isAdminMode = false
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <StyledTimelineItem ref={ref} inView={inView} isLeft={isLeft} isDeleted={isDeleted}>
      <TimelineContent isLeft={isLeft} isDeleted={isDeleted}>
        {imageUrl && !imageError && (
          <TimelineImageWrapper isLeft={isLeft}>
            <TimelineImage src={imageUrl} alt={title} onError={handleImageError} />
          </TimelineImageWrapper>
        )}
        <TimelineTextContent>
          <TimelineType>{type}</TimelineType>
          <TimelineTitle>{title}</TimelineTitle>
          {subtitle && <TimelineSubtitle>{subtitle}</TimelineSubtitle>}
          <TimelineText dangerouslySetInnerHTML={{ __html: content }} />
          <TimelineDate>{new Date(date).toLocaleDateString()}</TimelineDate>
          {isAdminMode && (
            <TimeInfo>
              <p>創建時間: {new Date(createdAt).toLocaleString()}</p>
              <p>更新時間: {new Date(updatedAt).toLocaleString()}</p>
              {deletedAt && <p>刪除時間: {new Date(deletedAt).toLocaleString()}</p>}
            </TimeInfo>
          )}
        </TimelineTextContent>
        {isAdminMode && (
          <MenuContainer>
            <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>⋮</MenuButton>
            {isMenuOpen && (
              <Menu>
                {isDeleted ? (
                  <MenuItem onClick={() => { onRestore(id); setIsMenuOpen(false); }}>恢復</MenuItem>
                ) : (
                  <>
                    <MenuItem onClick={() => { onEdit(id); setIsMenuOpen(false); }}>編輯</MenuItem>
                    <MenuItem onClick={() => { onDelete(id); setIsMenuOpen(false); }}>刪除</MenuItem>
                  </>
                )}
              </Menu>
            )}
          </MenuContainer>
        )}
      </TimelineContent>
    </StyledTimelineItem>
  );
};

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledTimelineItem = styled.div`
  padding: 20px 0;
  position: relative;
  width: 50%;
  opacity: ${({ inView }) => (inView ? 1 : 0)};
  transform: ${({ inView }) => (inView ? 'none' : 'translateY(50px)')};
  animation: ${({ inView }) => (inView ? slideIn : 'none')} 0.6s ease-out;
  margin-left: ${({ isLeft }) => (isLeft ? '0' : '50%')};
  ${({ isDeleted }) => isDeleted && css`
    opacity: 0.6;
  `}
`;

const TimelineContent = styled.div`
  padding: 20px;
  background-color: #fffaf0;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin: ${({ isLeft }) => (isLeft ? '0 50px 0 0' : '0 0 0 50px')};
  ${({ isDeleted }) => isDeleted && css`
    background-color: #f0f0f0;
  `}

  &:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    ${({ isLeft }) => (isLeft ? 'right: -60px;' : 'left: -60px;')}
    background-color: #d48c2e;
    border: 4px solid #fffaf0;
    top: 20px;
    border-radius: 50%;
    z-index: 1;
  }
`;

const TimelineImageWrapper = styled.div`
  position: absolute;
  ${({ isLeft }) => (isLeft ? 'left: -75px;' : 'right: -75px;')}
  top: 10px;
`;

const TimelineImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TimelineTextContent = styled.div`
  flex: 1;
`;

const TimelineType = styled.span`
  font-size: 0.8rem;
  color: #d48c2e;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

const TimelineTitle = styled.h3`
  margin: 0 0 5px 0;
  color: #8b5e3c;
  font-size: 1.4rem;
`;

const TimelineSubtitle = styled.h4`
  margin: 0 0 10px 0;
  color: #8b5e3c;
  font-size: 1.2rem;
`;

const TimelineText = styled.div`
  margin: 0 0 15px 0;
  color: #7a5533;
  font-size: 1rem;
  line-height: 1.5;
`;

const TimelineDate = styled.p`
  margin: 0;
  color: #d48c2e;
  font-size: 0.9rem;
  font-style: italic;
`;

const TimeInfo = styled.div`
  font-size: 0.8em;
  color: #666;
  margin-top: 10px;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #8b5e3c;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #d48c2e;
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background-color: #fffaf0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 10;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #d48c2e;
    color: white;
  }
`;

export default TimelineItem;