// src/api/aboutMeApi.js

import { apiCall } from './common/apiCall';
import { authApi } from './common/authApi';

// 公開路由
export const getAboutMe = () => apiCall('/aboutMe', 'GET');
export const getAboutMeById = (id) => apiCall(`/aboutMe/${id}`, 'GET');

// 需要權限的路由
export const getAllAdminAboutMe = () => 
  authApi.call('/admin/aboutMe', 'GET');

export const createAboutMe = (aboutMeData) => 
  authApi.call('/admin/aboutMe', 'POST', aboutMeData, aboutMeData instanceof FormData);

export const updateAboutMe = (id, aboutMeData) => 
  authApi.call(`/admin/aboutMe/${id}`, 'PUT', aboutMeData, aboutMeData instanceof FormData);

export const deleteAboutMe = (id) => 
  authApi.call(`/admin/aboutMe/${id}`, 'DELETE');

export const restoreAboutMe = (id) => 
  authApi.call(`/admin/aboutMe/${id}/restore`, 'POST');