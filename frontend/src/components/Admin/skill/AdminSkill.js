import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { getAllSkills, createSkill, updateSkill, deleteSkill, restoreSkill } from '../../../api/skillApi';
import TextEditor from '../../../components/common/TextEditor';
import Loading from '../../../components/common/Loading';
import { FaEdit, FaTrash, FaPlus, FaUndo } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await getAllSkills();
      setSkills(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter(skill => skill._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRestore = async (id) => {
    try {
      const restoredSkill = await restoreSkill(id);
      setSkills([...skills, restoredSkill]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingSkill) {
        const updatedSkill = await updateSkill(editingSkill._id, formData);
        setSkills(skills.map(skill => 
          skill._id === editingSkill._id ? updatedSkill : skill
        ));
      } else {
        const newSkill = await createSkill(formData);
        setSkills([...skills, newSkill]);
      }
      setIsEditing(false);
      setEditingSkill(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage>Error: {error}</ErrorMessage>;

  return (
    <SkillsContainer>
      <BackgroundPattern />
      <ContentWrapper>
        <SkillsHeader>
          <SkillsTitle>Manage Skills</SkillsTitle>
        </SkillsHeader>
        <AddButton onClick={() => setIsEditing(true)}><FaPlus /> Add New Skill</AddButton>
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
              <SkillEditor 
                skill={editingSkill} 
                onSave={handleSave}
                onCancel={() => {
                  setIsEditing(false);
                  setEditingSkill(null);
                }}
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

const SkillEditor = ({ skill, onSave, onCancel }) => {
  const [editedSkill, setEditedSkill] = useState(skill || { title: '', subtitle: '', content: '' });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setEditedSkill(prev => ({ ...prev, content }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editedSkill.title);
    formData.append('subtitle', editedSkill.subtitle);
    formData.append('content', editedSkill.content);
    if (file) {
      formData.append('image', file);
    }
    await onSave(formData);
  };

  return (
    <EditorForm onSubmit={handleSubmit}>
      <Input
        type="text"
        name="title"
        value={editedSkill.title}
        onChange={handleInputChange}
        placeholder="Title"
        required
      />
      <Input
        type="text"
        name="subtitle"
        value={editedSkill.subtitle}
        onChange={handleInputChange}
        placeholder="Subtitle"
      />
      <TextEditor value={editedSkill.content} onChange={handleContentChange} />
      <Input type="file" onChange={handleFileChange} />
      <ButtonGroup>
        <SubmitButton type="submit">Save</SubmitButton>
        <CancelButton type="button" onClick={onCancel}>Cancel</CancelButton>
      </ButtonGroup>
    </EditorForm>
  );
};

const SkillsContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: #f5e5d3; // 奶茶色背景
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
  color: #6b4226; // 深奶茶色
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const AddButton = styled.button`
  display: block;
  margin: 0 auto 30px;
  padding: 12px 24px;
  background-color: #8b5a2b; // 深奶茶色
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

const EditorForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #d3b08c;
  border-radius: 5px;
  color: #4a3520;

  &:focus {
    outline: none;
    border-color: #8b5a2b;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #8b5a2b;
  color: white;

  &:hover {
    background-color: #6b4226;
  }
`;

const CancelButton = styled(Button)`
  background-color: #d3b08c;
  color: #4a3520;

  &:hover {
    background-color: #c19a6b;
  }
`;

const ErrorMessage = styled.div`
  color: #b22222;
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  background-color: #ffe4e1;
  border-radius: 5px;
  margin: 20px;
`;

export default Skills;