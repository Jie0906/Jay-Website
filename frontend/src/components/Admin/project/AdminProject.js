import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaUndo } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { getAllAdminProjects, createProject, updateProject, deleteProject, restoreProject } from '../../../api/projectApi';
import TextEditor from '../../../components/common/TextEditor';
import Loading from '../../../components/common/Loading';
import { useMessage } from '../../../components/common/MessagePopup';

const AdminProject = () => {
  // State management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const { addMessage } = useMessage();

  // Fields configuration
  const fields = [
    { name: 'title', type: 'text', placeholder: '項目標題', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'content', type: 'content', placeholder: '項目內容' },
    { name: 'image', type: 'file', accept: 'image/*' }
  ];

  // Fetch data
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAdminProjects();
      setProjects(data);
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Event handlers
  const handleCreate = () => {
    setCurrentProject({ title: '', content: '', date: new Date() });
    setIsEditing(true);
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleSave = async (data, isFormData) => {
    try {
      setLoading(true);
      let dataToSend = prepareDataForSending(data, isFormData);
      let updatedProject;
      if (currentProject._id) {
        updatedProject = await updateProject(currentProject._id, dataToSend);
      } else {
        updatedProject = await createProject(dataToSend);
      }
      await fetchProjects();
      resetEditingState();
      addMessage(currentProject._id ? '項目已成功更新' : '新項目已成功創建', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteProject(id);
      await fetchProjects();
      addMessage('項目已成功刪除', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setLoading(true);
      await restoreProject(id);
      await fetchProjects();
      addMessage('項目已成功恢復', 'success');
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const resetEditingState = () => {
    setIsEditing(false);
    setCurrentProject(null);
  };

  const prepareDataForSending = (data, isFormData) => {
    if (isFormData) return data;
    if (data.image instanceof File) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      return formData;
    }
    return data;
  };

  // Render methods
  const renderProjects = () => (
    <ProjectList>
      {projects.map((project) => (
        <ProjectItem
          key={project._id}
          project={project}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          disabled={loading}
        />
      ))}
    </ProjectList>
  );

  if (loading && projects.length === 0) {
    return <Loading />;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <h1>Projects 管理</h1>
        <AddButton onClick={handleCreate} disabled={loading}>
          <FaPlus /> 添加新專案
        </AddButton>
      </AdminHeader>

      {renderProjects()}

      {isEditing && (
        <EditorOverlay>
          <EditorContainer>
            <TextEditor
              initialData={currentProject}
              onSave={handleSave}
              onCancel={resetEditingState}
              fields={fields}
              useFormData={true}
            />
          </EditorContainer>
        </EditorOverlay>
      )}
    </AdminContainer>
  );
};

// Sub-components
const ProjectItem = ({ project, onEdit, onDelete, onRestore, disabled }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <StyledProjectItem ref={ref} inView={inView} isDeleted={project.deleted}>
      {project.imageUrl && <ProjectImage src={project.imageUrl} alt={project.title} />}
      <ProjectContent>
        <ProjectTitle>{project.title || 'Untitled Project'}</ProjectTitle>
        <ProjectDate>{project.date ? new Date(project.date).toLocaleDateString() : 'No date'}</ProjectDate>
        <ProjectDescription dangerouslySetInnerHTML={{ __html: project.content ? project.content.substring(0, 100) + '...' : '' }} />
        <TimeInfo>
          <p>創建時間: {new Date(project.createdAt).toLocaleString()}</p>
          <p>更新時間: {new Date(project.updatedAt).toLocaleString()}</p>
          {project.deletedAt && <p>刪除時間: {new Date(project.deletedAt).toLocaleString()}</p>}
        </TimeInfo>
      </ProjectContent>
      <ActionButtons>
        {project.deleted ? (
          <ActionButton onClick={() => onRestore(project._id)} disabled={disabled}><FaUndo /></ActionButton>
        ) : (
          <>
            <ActionButton onClick={() => onEdit(project)} disabled={disabled}><FaEdit /></ActionButton>
            <ActionButton onClick={() => onDelete(project._id)} disabled={disabled}><FaTrash /></ActionButton>
          </>
        )}
      </ActionButtons>
    </StyledProjectItem>
  );
};

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AdminContainer = styled.div`
  padding: 50px;
  background-color: #f5e5d3;
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
  opacity: ${props => props.inView ? (props.isDeleted ? 0.6 : 1) : 0};
  transform: ${props => props.inView ? 'translateY(0)' : 'translateY(20px)'};
  animation: ${fadeIn} 0.5s ease forwards;

  ${props => props.isDeleted && css`
    background-color: #f0f0f0;
  `}

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

const ProjectDescription = styled.div`
  color: #4a3520;
  font-size: 1rem;
  line-height: 1.4;
`;

const TimeInfo = styled.div`
  font-size: 0.8em;
  color: #666;
  margin-top: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
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

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #8b5a2b;
  cursor: pointer;
  font-size: 1.2rem;
  margin: 5px 0;
  transition: color 0.3s;
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

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
`;

const EditorContainer = styled.div`
  background-color: #fffaf0;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

export default AdminProject;