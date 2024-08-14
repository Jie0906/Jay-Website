import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAllSkills, createSkill, updateSkill, deleteSkill, restoreSkill } from '../../../api/skillApi';
import TextEditor from '../../../components/common/TextEditor';
import Loading from '../../../components/common/Loading';
import { useMessage } from '../../../components/common/MessagePopup';
import { FaEdit, FaTrash, FaPlus, FaUndo } from 'react-icons/fa';

const AdminSkill = () => {
  // State management
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const { addMessage } = useMessage();

  // Fields configuration
  const fields = [
    { name: 'title', type: 'text', placeholder: '技能名稱', required: true },
    { name: 'subtitle', type: 'text', placeholder: '簡短描述' },
    { name: 'content', type: 'content', placeholder: '詳細描述...' },
  ];

  // Fetch data
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSkills();
      setSkills(data);
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Event handlers
  const handleCreate = () => {
    setCurrentSkill({ title: '', subtitle: '', content: '' });
    setIsEditing(true);
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setIsEditing(true);
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      if (currentSkill._id) {
        await updateSkill(currentSkill._id, data);
      } else {
        await createSkill(data);
      }
      await fetchSkills();
      resetEditingState();
      addMessage(currentSkill._id ? '技能已成功更新' : '新技能已成功創建', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteSkill(id);
      await fetchSkills();
      addMessage('技能已成功刪除', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setLoading(true);
      await restoreSkill(id);
      await fetchSkills();
      addMessage('技能已成功恢復', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const resetEditingState = () => {
    setIsEditing(false);
    setCurrentSkill(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SkillsContainer>
      <BackgroundPattern />
      <ContentWrapper>
        <SkillsHeader>
          <SkillsTitle>Skills 管理</SkillsTitle>
          <AddButton onClick={handleCreate}><FaPlus /> 添加新技能</AddButton>
        </SkillsHeader>
        <SkillsList>
          {skills.map((skill) => (
            <SkillItem 
              key={skill._id} 
              skill={skill} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />
          ))}
        </SkillsList>
        {isEditing && (
          <EditorOverlay>
            <EditorContainer>
              <TextEditor
                initialData={currentSkill}
                onSave={handleSave}
                onCancel={resetEditingState}
                fields={fields}
              />
            </EditorContainer>
          </EditorOverlay>
        )}
      </ContentWrapper>
    </SkillsContainer>
  );
};

const SkillItem = ({ skill, onEdit, onDelete, onRestore }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <StyledSkillItem ref={ref} inView={inView}>
      <SkillImageWrapper>
        {skill.imageUrl && <SkillImage src={skill.imageUrl} alt={skill.title} />}
      </SkillImageWrapper>
      <SkillContent>
        <SkillTitle>{skill.title}</SkillTitle>
        <SkillSubtitle>{skill.subtitle}</SkillSubtitle>
        <SkillDescription dangerouslySetInnerHTML={{ __html: skill.content }} />
      </SkillContent>
      <ActionButtons>
        <ActionButton onClick={() => onEdit(skill)}><FaEdit /></ActionButton>
        {skill.deleted ? (
          <ActionButton onClick={() => onRestore(skill._id)}><FaUndo /></ActionButton>
        ) : (
          <ActionButton onClick={() => onDelete(skill._id)}><FaTrash /></ActionButton>
        )}
      </ActionButtons>
    </StyledSkillItem>
  );
};

// Styled components (保持原有的樣式)
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const SkillsContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: #f5e5d3;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(#e6c9a8 20%, transparent 20%),
    radial-gradient(#e6c9a8 20%, transparent 20%);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
  opacity: 0.3;
`;

const ContentWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
  z-index: 1;
`;

const SkillsHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SkillsTitle = styled.h1`
  color: #6b4226;
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const AddButton = styled.button`
  display: block;
  margin: 20px auto 30px;
  padding: 12px 24px;
  background-color: #8b5a2b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #6b4226;
    transform: translateY(-2px);
  }
`;

const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledSkillItem = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.inView ? 1 : 0};
  transform: ${props => props.inView ? 'translateY(0)' : 'translateY(30px)'};
  animation: ${slideIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const SkillImageWrapper = styled.div`
  width: 200px;
  height: 200px;
  overflow: hidden;
`;

const SkillImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SkillContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const SkillTitle = styled.h2`
  color: #6b4226;
  margin: 0 0 10px 0;
`;

const SkillSubtitle = styled.h3`
  color: #8b5a2b;
  font-size: 1rem;
  margin: 0 0 15px 0;
`;

const SkillDescription = styled.div`
  color: #4a3520;
  font-size: 0.9rem;
  line-height: 1.6;
  max-height: 100px;
  overflow-y: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #8b5a2b;
  cursor: pointer;
  margin: 5px 0;
  transition: color 0.3s;

  &:hover {
    color: #6b4226;
  }
`;

const EditorOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const EditorContainer = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease-out;
`;

export default AdminSkill;