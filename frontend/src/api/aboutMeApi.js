const API_URL = process.env.REACT_APP_API_URL;

export const getAboutMe = async () => {
  const response = await fetch(`${API_URL}/aboutMe`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

export const getAboutMeById = async (id) => {
  const response = await fetch(`${API_URL}/aboutMe/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

export const createAboutMe = async (aboutMeData) => {
  const response = await fetch(`${API_URL}/aboutMe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(aboutMeData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

export const updateAboutMe = async (id, aboutMeData) => {
  const response = await fetch(`${API_URL}/aboutMe/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(aboutMeData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

export const deleteAboutMe = async (id) => {
  const response = await fetch(`${API_URL}/aboutMe/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
};

export const restoreAboutMe = async (id) => {
  const response = await fetch(`${API_URL}/aboutMe/restore/${id}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};
