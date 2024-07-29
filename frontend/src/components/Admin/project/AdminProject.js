import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { getAllProjects, createProject, updateProject, deleteProject } from '../../../api/projectApi';
import TextEditor from '../../../components/common/TextEditor';

const AdminProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSave = async (projectData) => {
    try {
      if (editingProject) {
        const updatedProject = await updateProject(editingProject._id, projectData);
        setProjects(projects.map(project => 
          project._id === editingProject._id ? updatedProject : project
        ));
      } else {
        const newProject = await createProject(projectData);
        setProjects([...projects, newProject]);
      }
      setIsEditing(false);
      setEditingProject(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <LoadingScreen>Loading...</LoadingScreen>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <AdminContainer>
      <Header>
        <Title>Manage Projects</Title>
        <AddButton onClick={() => setIsEditing(true)}><FaPlus /> Add New Project</AddButton>
      </Header>
      <ProjectList>
        {projects.map((project) => (
          <ProjectItem 
            key={project._id} 
            project={project} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ProjectList>
      {isEditing && (
        <EditorOverlay>
          <EditorContainer>
            <ProjectEditor 
              project={editingProject} 
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setEditingProject(null);
              }}
            />
          </EditorContainer>
        </EditorOverlay>
      )}
    </AdminContainer>
  );
};

const ProjectItem = ({ project, onEdit, onDelete }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <StyledProjectItem ref={ref} inView={inView}>
      <ProjectImage src={project.image || 'https://via.placeholder.com/150'} alt={project.title} />
      <ProjectContent>
        <ProjectTitle>{project.title}</ProjectTitle>
        <ProjectDate>{new Date(project.date).toLocaleDateString()}</ProjectDate>
        <ProjectDescription>{project.content.substring(0, 100)}...</ProjectDescription>
      </ProjectContent>
      <ActionButtons>
        <ActionButton onClick={() => onEdit(project)}><FaEdit /></ActionButton>
        <ActionButton onClick={() => onDelete(project._id)}><FaTrash /></ActionButton>
      </ActionButtons>
    </StyledProjectItem>
  );
};

const ProjectEditor = ({ project, onSave, onCancel }) => {
  const [editedProject, setEditedProject] = useState(project || { title: '', content: '', date: new Date() });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setEditedProject(prev => ({ ...prev, content }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editedProject.title);
    formData.append('content', editedProject.content);
    formData.append('date', editedProject.date);
    if (file) {
      formData.append('image', file);
    }
    onSave(formData);
  };

  return (
    <EditorForm onSubmit={handleSubmit}>
      <Input
        type="text"
        name="title"
        value={editedProject.title}
        onChange={handleInputChange}
        placeholder="Project Title"
        required
      />
      <Input
        type="date"
        name="date"
        value={editedProject.date}
        onChange={handleInputChange}
        required
      />
      <TextEditor value={editedProject.content} onChange={handleContentChange} />
      <Input type="file" onChange={handleFileChange} />
      <ButtonGroup>
        <SubmitButton type="submit">Save</SubmitButton>
        <CancelButton type="button" onClick={onCancel}>Cancel</CancelButton>
      </ButtonGroup>
    </EditorForm>
  );
};

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const AdminContainer = styled.div`
  padding: 50px;
  background-color: #f5e5d3;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #6b4226;
  font-size: 2.5rem;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #8b5a2b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6b4226;
  }
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledProjectItem = styled.div`
  display: flex;
  background-color: #fffaf0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: ${props => props.inView ? 1 : 0};
  transform: ${props => props.inView ? 'translateY(0)' : 'translateY(20px)'};
  animation: ${slideIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
`;

const ProjectContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const ProjectTitle = styled.h3`
  color: #6b4226;
  margin: 0 0 10px 0;
`;

const ProjectDate = styled.p`
  color: #8b5a2b;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
`;

const ProjectDescription = styled.p`
  color: #4a3520;
  font-size: 1rem;
  line-height: 1.4;
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
  color: #8b5a2b;
  cursor: pointer;
  font-size: 1.2rem;
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
  background-color: #fffaf0;
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
  border: 1px solid #d3b08c;
  border-radius: 5px;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
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

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #6b4226;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
`;

export default AdminProject;