const API_URL = process.env.REACT_APP_API_URL;

export const fetchBlogs = async () => {
  const response = await fetch(`${API_URL}/blog`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createBlog = async (blogData) => {
  const response = await fetch(`${API_URL}/blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const getBlogById = async (id) => {
  const response = await fetch(`${API_URL}/blog/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const updateBlog = async (id, blogData) => {
  const response = await fetch(`${API_URL}/blog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const deleteBlog = async (id) => {
  const response = await fetch(`${API_URL}/blog/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response;
};

export const restoreBlog = async (id) => {
  const response = await fetch(`${API_URL}/blog/${id}/restore`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};