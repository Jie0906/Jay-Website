import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAllAdminSkills, createSkill, updateSkill, deleteSkill, restoreSkill } from '../../../api/skillApi';
import TextEditor from '../../../components/common/TextEditor';
import Loading from '../../../components/common/Loading';
import { useMessage } from '../../../components/common/MessagePopup';

const AdminSkill = () => {
  const [skillContent, setSkillContent] = useState({
    technical: [],
    certification: []
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const { addMessage } = useMessage();

  const fields = [
    { name: 'title', type: 'text', placeholder: '標題', required: true },
    { name: 'type', type: 'select', placeholder: '選擇類型', required: true, options: [
      { value: 'technical', label: '技術技能' },
      { value: 'certification', label: '專業證照' }
    ]},
    { name: 'subtitle', type: 'text', placeholder: '副標題' },
    { name: 'content', type: 'content', placeholder: '請輸入內容...' }
  ];

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAdminSkills();
      const technical = data.filter(skill => skill.type === 'technical');
      const certification = data.filter(skill => skill.type === 'certification');
      setSkillContent({ technical, certification });
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleCreate = () => {
    setCurrentItem({ title: '', subtitle: '', content: '', type: '' });
    setSelectedType('');
    setIsEditing(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setSelectedType(item.type);
    setIsEditing(true);
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      if (currentItem._id) {
        await updateSkill(currentItem._id, data);
      } else {
        await createSkill(data);
      }
      await fetchSkills();
      resetEditingState();
      addMessage(currentItem._id ? '技能已成功更新' : '新技能已成功創建', 'success');
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

  const resetEditingState = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setSelectedType('');
  };

  const renderSkillSection = (title, items) => (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      <SkillContainer>
        {items.map((item, index) => (
          <SkillCard key={item._id} delay={index * 0.1} isDeleted={item.isDeleted}>
            <CardContent isDeleted={item.isDeleted}>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
              <TimeInfo>
                <p>創建時間: {new Date(item.createdAt).toLocaleString()}</p>
                <p>更新時間: {new Date(item.updatedAt).toLocaleString()}</p>
                {item.deletedAt && <p>刪除時間: {new Date(item.deletedAt).toLocaleString()}</p>}
              </TimeInfo>
              <ButtonGroup>
                {item.isDeleted ? (
                  <RestoreButton onClick={() => handleRestore(item._id)}>恢復</RestoreButton>
                ) : (
                  <>
                    <EditButton onClick={() => handleEdit(item)}>編輯</EditButton>
                    <DeleteButton onClick={() => handleDelete(item._id)}>刪除</DeleteButton>
                  </>
                )}
              </ButtonGroup>
            </CardContent>
          </SkillCard>
        ))}
      </SkillContainer>
    </Section>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>Skills 管理</h1>
        <AddButton onClick={handleCreate}>新增技能</AddButton>
      </AdminHeader>

      {renderSkillSection('技術技能', skillContent.technical)}
      {renderSkillSection('專業證照', skillContent.certification)}

      {isEditing && (
        <EditorOverlay>
          <TextEditor
            initialData={currentItem}
            onSave={handleSave}
            onCancel={resetEditingState}
            fields={fields}
          />
        </EditorOverlay>
      )}
    </AdminContainer>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AdminContainer = styled.div`
  padding: 50px;
  background-color: #fef5e7;
  min-height: 100vh;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    margin: 0;
    color: #8b5e3c;
  }
`;

const Section = styled.div`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  color: #8b5e3c;
  margin-bottom: 20px;
`;

const SkillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Card = styled.div`
  background-color: #fffaf0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, opacity 0.3s ease;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${props => props.delay}s;
  opacity: 0;
  width: calc(33.33% - 20px);

  &:hover {
    transform: translateY(-5px);
  }

  ${props => props.isDeleted && css`
    opacity: 0.6;
  `}

  @media (max-width: 1024px) {
    width: calc(50% - 20px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SkillCard = styled(Card)``;

const CardContent = styled.div`
  padding: 20px;
  ${props => props.isDeleted && css`
    background-color: #f0f0f0;
  `}
`;

const TimeInfo = styled.div`
  font-size: 0.8em;
  color: #666;
  margin-top: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AddButton = styled(Button)`
  background-color: #8b5e3c;
  color: #fff;

  &:hover {
    background-color: #7a5533;
  }
`;

const EditButton = styled(Button)`
  background-color: #4caf50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;
  color: white;

  &:hover {
    background-color: #da190b;
  }
`;

const RestoreButton = styled(Button)`
  background-color: #2196f3;
  color: white;

  &:hover {
    background-color: #0b7dda;
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
`;

export default AdminSkill;