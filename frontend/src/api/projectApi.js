// src/api/projectApi.js
import { apiCall } from './common/apiCall';
import { authApi } from './common/authApi';

// 公開路由
export const getAllProjects = () => apiCall('/project', 'GET');
export const getProjectById = (id) => apiCall(`/project/${id}`, 'GET');

// 管理員路由（包括已刪除的項目）
export const getAllAdminProjects = () => authApi.call('/admin/project', 'GET');
export const getAdminProjectById = (id) => authApi.call(`/admin/project/${id}`, 'GET');

// 需要權限的路由
export const createProject = (projectData) =>
  authApi.call('/admin/project', 'POST', projectData, projectData instanceof FormData);

export const updateProject = (id, projectData) =>
  authApi.call(`/admin/project/${id}`, 'PUT', projectData, projectData instanceof FormData);

export const deleteProject = (id) => authApi.call(`/admin/project/${id}`, 'DELETE');

export const restoreProject = (id) => authApi.call(`/admin/project/${id}/restore`, 'POST');