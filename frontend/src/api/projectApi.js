import { apiCall } from '../api/common/apiCall';

export const getAllProjects = () => apiCall('/project', 'GET');

export const getProjectById = (id) => apiCall(`/project/${id}`, 'GET');

export const createProject = (projectData) => 
  apiCall('/admin/project', 'POST', projectData, projectData instanceof FormData);

export const updateProject = (id, projectData) => 
  apiCall(`/admin/project/${id}`, 'PUT', projectData, projectData instanceof FormData);

export const deleteProject = (id) => apiCall(`/admin/project/${id}`, 'DELETE');

export const restoreProject = (id) => apiCall(`/admin/project/${id}/restore`, 'POST');