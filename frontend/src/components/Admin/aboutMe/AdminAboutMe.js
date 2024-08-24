import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { getAllAdminAboutMe, createAboutMe, updateAboutMe, deleteAboutMe, restoreAboutMe } from '../../../api/aboutMeApi';
import Loading from '../../common/Loading';
import { useMessage } from '../../common/MessagePopup';
import TimelineItem from '../../common/TimelineItem';
import TextEditor from '../../common/TextEditor';

const AdminAboutMe = () => {
  // State management
  const [aboutMeContent, setAboutMeContent] = useState({
    autobiography: [],
    education: [],
    experience: []
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const { addMessage } = useMessage();

  // Fields configuration
  const fields = [
    { name: 'title', type: 'text', placeholder: '標題', required: true },
    { name: 'type', type: 'select', placeholder: '選擇類型', required: true, options: [
      { value: 'autobiography', label: '自傳' },
      { value: 'education', label: '學歷' },
      { value: 'experience', label: '經驗' }
    ]},
    { name: 'content', type: 'content', placeholder: '請輸入內容...' }
  ];

  // Fetch data
  const fetchAboutMe = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAdminAboutMe();
      console.log(data);
      setAboutMeContent(data.content);
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  useEffect(() => {
    fetchAboutMe();
  }, [fetchAboutMe]);

  // Event handlers
  const handleCreate = () => {
    setCurrentItem({ title: '', subtitle: '', content: '', date: new Date(), type: '' });
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
        await updateAboutMe(currentItem._id, data);
      } else {
        await createAboutMe(data);
      }
      await fetchAboutMe();
      resetEditingState();
      addMessage(currentItem._id ? '內容已成功更新' : '新內容已成功創建', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteAboutMe(id);
      await fetchAboutMe();
      addMessage('內容已成功刪除', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setLoading(true);
      await restoreAboutMe(id);
      await fetchAboutMe();
      addMessage('內容已成功恢復', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const resetEditingState = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setSelectedType('');
  };

  // Render methods
  const renderAutobiography = () => (
    <Section>
      <SectionTitle>自傳</SectionTitle>
      <AutobiographyContainer>
        {aboutMeContent.autobiography.map((item, index) => (
          <AutobiographyCard key={item._id} delay={index * 0.1} isDeleted={item.isDeleted}>
            <CardContent isDeleted={item.isDeleted}>
              <h3>{item.title}</h3>
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
          </AutobiographyCard>
        ))}
      </AutobiographyContainer>
    </Section>
  );

  const renderEducation = () => (
    <Section>
      <SectionTitle>學歷</SectionTitle>
      <Timeline>
        {aboutMeContent.education.map((item, index) => (
          <TimelineItem
            key={item._id}
            {...item}
            isLeft={index % 2 === 0}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id)}
            onRestore={() => handleRestore(item._id)}
            isDeleted={item.deleted}
            createdAt={item.createdAt}
            updatedAt={item.updatedAt}
            deletedAt={item.deletedAt}
            isAdminMode={true}
          />
        ))}
      </Timeline>
    </Section>
  );

  const renderExperience = () => (
    <Section>
      <SectionTitle>經驗</SectionTitle>
      <ExperienceContainer>
        {aboutMeContent.experience.map((item, index) => (
          <ExperienceCard key={item._id} delay={index * 0.1} isDeleted={item.isDeleted}>
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
          </ExperienceCard>
        ))}
      </ExperienceContainer>
    </Section>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>About Me 管理</h1>
        <AddButton onClick={handleCreate}>新增個人資料</AddButton>
      </AdminHeader>

      {renderAutobiography()}
      {renderEducation()}
      {renderExperience()}

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

const AutobiographyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ExperienceContainer = styled.div`
  display: flex;
  flex-direction: column;
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

  &:hover {
    transform: translateY(-5px);
  }

  ${props => props.isDeleted && css`
    opacity: 0.6;
  `}
`;

const CardContent = styled.div`
  padding: 20px;
  ${props => props.isDeleted && css`
    background-color: #f0f0f0;
  `}
`;

const AutobiographyCard = styled(Card)`
  width: 100%;
`;

const ExperienceCard = styled(Card)`
  width: 100%;
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

export default AdminAboutMe;