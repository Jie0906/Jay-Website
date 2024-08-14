const API_URL = process.env.REACT_APP_API_URL;

export const getAboutMe = async () => {
  const response = await fetch(`${API_URL}/aboutMe`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data; // 現在這將返回已分組的數據
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
  let body;
  let headers = {};
  
  if (aboutMeData instanceof FormData) {
    body = aboutMeData;
  } else {
    body = JSON.stringify(aboutMeData);
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_URL}/admin/aboutMe`, {
    method: 'POST',
    headers,
    body,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }
  return await response.json();
};

export const updateAboutMe = async (id, aboutMeData) => {
  let body;
  let headers = {};
   
  if (aboutMeData instanceof FormData) {
    body = aboutMeData;
  } else {
    body = JSON.stringify(aboutMeData);
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_URL}/admin/aboutMe/${id}`, {
    method: 'PUT',
    headers,
    body,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }
  return await response.json();
};

export const deleteAboutMe = async (id) => {
  const response = await fetch(`${API_URL}/admin/aboutMe/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '刪除失敗');
  }
  return await response.json();
};

export const restoreAboutMe = async (id) => {
  const response = await fetch(`${API_URL}/admin/aboutMe/restore/${id}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};