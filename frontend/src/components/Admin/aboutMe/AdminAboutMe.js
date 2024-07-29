import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getAboutMe, createAboutMe, updateAboutMe, deleteAboutMe } from '../../../api/aboutMeApi';
import { useInView } from 'react-intersection-observer';
import Loading from '../../common/Loading';
import TextEditor from '../../common/TextEditor';

const AdminAboutMe = () => {
  const [aboutMeContent, setAboutMeContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const fetchAboutMe = async () => {
    try {
      const data = await getAboutMe();
      setAboutMeContent(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCurrentItem({ title: '', subtitle: '', content: '', date: new Date() });
    setEditorContent('');
    setIsEditing(true);
  };

  const handleUpdate = async (id) => {
    const updatedItem = { ...currentItem, content: editorContent };
    try {
      await updateAboutMe(id, updatedItem);
      await fetchAboutMe();
      setIsEditing(false);
      setCurrentItem(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAboutMe(id);
      await fetchAboutMe();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditorContent(item.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', currentItem.title);
      formData.append('subtitle', currentItem.subtitle);
      formData.append('content', editorContent);
      formData.append('date', currentItem.date);
      if (currentItem.file) {
        formData.append('image', currentItem.file);
      }

      if (currentItem._id) {
        await updateAboutMe(currentItem._id, formData);
      } else {
        await createAboutMe(formData);
      }
      await fetchAboutMe();
      setIsEditing(false);
      setCurrentItem(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>About Me 管理</h1>
        {!isEditing && <AddButton onClick={handleCreate}>新增資料</AddButton>}
      </AdminHeader>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Timeline>
        {aboutMeContent.map((item, index) => (
          <TimelineItem
            key={item._id}
            id={item._id}
            date={item.date}
            subtitle={item.subtitle}
            content={item.content}
            fileUrl={item.imageUrl}
            isLeft={index % 2 === 0}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id)}
          />
        ))}
      </Timeline>
      {isEditing && (
        <EditorContainer>
          <Input
            type="text"
            value={currentItem.title}
            onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
            placeholder="標題"
          />
          <Input
            type="text"
            value={currentItem.subtitle}
            onChange={(e) => setCurrentItem({ ...currentItem, subtitle: e.target.value })}
            placeholder="副標題"
          />
          <TextEditor value={editorContent} onChange={setEditorContent} />
          <input
            type="file"
            onChange={(e) => setCurrentItem({ ...currentItem, file: e.target.files[0] })}
          />
          <ButtonGroup>
            <SaveButton onClick={handleSave}>保存</SaveButton>
            <CancelButton onClick={() => setIsEditing(false)}>取消</CancelButton>
          </ButtonGroup>
        </EditorContainer>
      )}
    </AdminContainer>
  );
};

const TimelineItem = ({ id, date, subtitle, content, fileUrl, isLeft, onEdit, onDelete }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <StyledTimelineItem ref={ref} inView={inView} isLeft={isLeft}>
      <TimelineContent isLeft={isLeft}>
        <TimelineImageWrapper isLeft={isLeft}>
          <TimelineImage src={fileUrl} alt={subtitle} />
        </TimelineImageWrapper>
        <TimelineTextContent>
          <TimelineSubtitle>{subtitle}</TimelineSubtitle>
          <TimelineText dangerouslySetInnerHTML={{ __html: content }} />
          <TimelineDate>{new Date(date).toLocaleDateString()}</TimelineDate>
        </TimelineTextContent>
        <MenuContainer>
          <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>⋮</MenuButton>
          {isMenuOpen && (
            <Menu>
              <MenuItem onClick={onEdit}>編輯</MenuItem>
              <MenuItem onClick={onDelete}>刪除</MenuItem>
            </Menu>
          )}
        </MenuContainer>
      </TimelineContent>
    </StyledTimelineItem>
  );
};

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

const EditorContainer = styled.div`
  margin-top: 30px;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  background-color: #fffaf0;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const SaveButton = styled(Button)`
  background-color: #8b5e3c;
  color: #fff;

  &:hover {
    background-color: #7a5533;
  }
`;

const CancelButton = styled(Button)`
  background-color: #d48c2e;
  color: #fff;

  &:hover {
    background-color: #b37524;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #d48c2e;
  border-radius: 5px;
`;

export default AdminAboutMe;