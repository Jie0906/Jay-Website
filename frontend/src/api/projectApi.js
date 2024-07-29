const API_URL = process.env.REACT_APP_API_URL;

export const getAllProjects = async () => {
  const response = await fetch(`${API_URL}/project`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const getProjectById = async (id) => {
  const response = await fetch(`${API_URL}/project/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createProject = async (projectData) => {
  const formData = new FormData();
  for (const key in projectData) {
    formData.append(key, projectData[key]);
  }

  const response = await fetch(`${API_URL}/project`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const updateProject = async (id, projectData) => {
  const formData = new FormData();
  for (const key in projectData) {
    formData.append(key, projectData[key]);
  }

  const response = await fetch(`${API_URL}/project/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const deleteProject = async (id) => {
  const response = await fetch(`${API_URL}/project/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response;
};

export const restoreProject = async (id) => {
  const response = await fetch(`${API_URL}/project/${id}/restore`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};