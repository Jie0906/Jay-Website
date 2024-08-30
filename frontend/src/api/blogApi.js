// api/blogApi.js
import { apiCall } from './common/apiCall';
import { authApi } from './common/authApi';

// 公開路由
// 獲取所有博客（帶分頁和搜索）
export const fetchBlogs = (page, limit, search) => 
  apiCall('/blog', 'GET', { page, limit, search });

// 獲取單個博客
export const getBlogById = (id) => 
  apiCall(`/blog/${id}`, 'GET');

// 需要權限的路由
// 獲取所有博客（包括已刪除的，管理員用）
export const fetchAdminBlogs = (page, limit, search) => 
  authApi.call('/admin/blog', 'GET', { page, limit, search });

// 獲取單個博客（包括已刪除的，管理員用）
export const getAdminBlogById = (id) => 
  authApi.call(`/admin/blog/${id}`, 'GET');

// 創建博客
export const createBlog = (blogData) => 
  authApi.call('/admin/blog', 'POST', blogData, blogData instanceof FormData);

// 更新博客
export const updateBlog = (id, blogData) => 
  authApi.call(`/admin/blog/${id}`, 'PUT', blogData, blogData instanceof FormData);

// 刪除博客
export const deleteBlog = (id) => 
  authApi.call(`/admin/blog/${id}`, 'DELETE');

// 恢復博客
export const restoreBlog = (id) => 
  authApi.call(`/admin/blog/${id}/restore`, 'POST');