// src/api/skillApi.js
import { apiCall } from './common/apiCall';
import { authApi } from './common/authApi';

// 公開路由
export const getAllSkills = () => apiCall('/skill', 'GET');
export const getSkillById = (id) => apiCall(`/skill/${id}`, 'GET');

// 管理員路由（包括已刪除的項目）
export const getAllAdminSkills = () => authApi.call('/admin/skill', 'GET');
export const getAdminSkillById = (id) => authApi.call(`/admin/skill/${id}`, 'GET');

// 需要權限的路由
export const createSkill = (skillData) =>
  authApi.call('/admin/skill', 'POST', skillData, skillData instanceof FormData);

export const updateSkill = (id, skillData) =>
  authApi.call(`/admin/skill/${id}`, 'PUT', skillData, skillData instanceof FormData);

export const deleteSkill = (id) => authApi.call(`/admin/skill/${id}`, 'DELETE');

export const restoreSkill = (id) => authApi.call(`/admin/skill/${id}/restore`, 'POST');