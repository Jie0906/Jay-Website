// api/blogApi.js
import { apiCall } from '../api/common/apiCall'

// 獲取所有博客（帶分頁和搜索）
export const fetchBlogs = (page, limit, search) => 
  apiCall('/blog', 'GET', { page, limit, search });

// 創建博客
export const createBlog = (blogData) => 
  apiCall('/admin/blog', 'POST', blogData, blogData instanceof FormData);

// 獲取單個博客
export const getBlogById = (id) => 
  apiCall(`/blog/${id}`, 'GET');

// 更新博客
export const updateBlog = (id, blogData) => 
  apiCall(`/admin/blog/${id}`, 'PUT', blogData);

// 刪除博客
export const deleteBlog = (id) => 
  apiCall(`/admin/blog/${id}`, 'DELETE');

// 恢復博客
export const restoreBlog = (id) => 
  apiCall(`/admin/blog/${id}/restore`, 'POST');