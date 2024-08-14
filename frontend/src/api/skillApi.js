import { apiCall } from '../api/common/apiCall';

export const getAllSkills = () => apiCall('/skill', 'GET');

export const getSkillById = (id) => apiCall(`/skill/${id}`, 'GET');

export const createSkill = (skillData) => 
  apiCall('/admin/skill', 'POST', skillData, skillData instanceof FormData);

export const updateSkill = (id, skillData) => 
  apiCall(`/admin/skill/${id}`, 'PUT', skillData, skillData instanceof FormData);

export const deleteSkill = (id) => apiCall(`/admin/skill/${id}`, 'DELETE');

export const restoreSkill = (id) => apiCall(`/admin/skill/${id}/restore`, 'POST');