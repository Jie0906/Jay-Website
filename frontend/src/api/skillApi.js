// skillApi.js

const API_URL = process.env.REACT_APP_API_URL;

export const getAllSkills = async () => {
  const response = await fetch(`${API_URL}/skill`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createSkill = async (formData) => {
  const response = await fetch(`${API_URL}/skill`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const updateSkill = async (id, formData) => {
  const response = await fetch(`${API_URL}/skill/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const deleteSkill = async (id) => {
  const response = await fetch(`${API_URL}/skill/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response;
};

export const restoreSkill = async (id) => {
  const response = await fetch(`${API_URL}/skill/${id}/restore`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};