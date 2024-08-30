import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaUndo, FaTags } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { fetchBlogs, createBlog, updateBlog, deleteBlog, restoreBlog } from '../../../api/blogApi';
import TextEditor from '../../../components/common/TextEditor';
import Loading from '../../../components/common/Loading';
import { useMessage } from '../../../components/common/MessagePopup';
import DOMPurify from 'dompurify';

const AdminBlog = () => {
  // State management
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['技術筆記', '刷題心得']);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const { addMessage } = useMessage();

  // Fields configuration
  const fields = [
    { name: 'title', type: 'text', placeholder: '標題', required: true },
    { name: 'category', type: 'select', placeholder: '選擇分類', options: categories.map(c => ({ value: c, label: c })), required: true },
    { name: 'content', type: 'content', placeholder: '文章內容', required: true },
    { name: 'date', type: 'date', placeholder: '發布日期', required: true },
  ];

  // Fetch data
  const fetchAllBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBlogs(page, limit, search);
      setBlogs(data.posts || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, addMessage]);

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  // Event handlers
  const handleCreate = () => {
    setCurrentBlog({ title: '', category: '', content: '', date: new Date().toISOString().split('T')[0] });
    setIsEditing(true);
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  const handleSave = async (blogData) => {
    try {
      setLoading(true);
      if (currentBlog._id) {
        await updateBlog(currentBlog._id, blogData);
        addMessage('文章已成功更新', 'success');
      } else {
        await createBlog(blogData);
        addMessage('新文章已成功創建', 'success');
      }
      await fetchAllBlogs();
      resetEditingState();
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteBlog(id);
      addMessage('文章已成功刪除', 'success');
      await fetchAllBlogs();
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setLoading(true);
      await restoreBlog(id);
      addMessage('文章已成功恢復', 'success');
      await fetchAllBlogs();
    } catch (error) {
      addMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const resetEditingState = () => {
    setIsEditing(false);
    setCurrentBlog(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const filteredBlogs = selectedCategory === '全部' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  if (loading) {
    return <Loading />;
  }

  return (
    <AdminContainer>
      <Sidebar>
        <SidebarTitle>Blog 管理</SidebarTitle>
        <CategoryList>
          <CategoryItem 
            active={selectedCategory === '全部'} 
            onClick={() => setSelectedCategory('全部')}
          >
            全部
          </CategoryItem>
          {categories.map(category => (
            <CategoryItem 
              key={category} 
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryItem>
          ))}
        </CategoryList>
        <AddButton onClick={handleCreate}>
          <FaPlus /> 新增文章
        </AddButton>
      </Sidebar>
      <MainContent>
        <SearchBar>
          <Input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索文章..."
          />
        </SearchBar>
        <BlogList>
          {filteredBlogs.map(blog => (
            <BlogItem 
              key={blog._id} 
              blog={blog} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore} 
            />
          ))}
        </BlogList>
        {totalPages > 1 && (
          <Pagination>
            <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              上一頁
            </PaginationButton>
            <PageInfo>第 {page} 頁，共 {totalPages} 頁</PageInfo>
            <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              下一頁
            </PaginationButton>
          </Pagination>
        )}
      </MainContent>
      {isEditing && (
        <EditorOverlay>
          <EditorContainer>
            <TextEditor 
              initialData={currentBlog}
              onSave={handleSave}
              onCancel={resetEditingState}
              fields={fields}
            />
          </EditorContainer>
        </EditorOverlay>
      )}
    </AdminContainer>
  );
};

const BlogItem = ({ blog, onEdit, onDelete, onRestore }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const truncateHTML = (html, maxLength) => {
    const clean = DOMPurify.sanitize(html);
    const div = document.createElement('div');
    div.innerHTML = clean;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
  };

  return (
    <StyledBlogItem ref={ref} inView={inView}>
      <BlogHeader>
        <BlogTitle>{blog.title}</BlogTitle>
        <ActionButtons>
          <ActionButton onClick={() => onEdit(blog)}><FaEdit /></ActionButton>
          {blog.deleted ? (
            <ActionButton onClick={() => onRestore(blog._id)}><FaUndo /></ActionButton>
          ) : (
            <ActionButton onClick={() => onDelete(blog._id)}><FaTrash /></ActionButton>
          )}
        </ActionButtons>
      </BlogHeader>
      <BlogMeta>
        <BlogDate>{new Date(blog.date).toLocaleDateString()}</BlogDate>
        <BlogCategory><FaTags /> {blog.category}</BlogCategory>
      </BlogMeta>
      <BlogContent>{truncateHTML(blog.content, 150)}</BlogContent>
    </StyledBlogItem>
  );
};

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5e5d3;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #e6c9a8;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
`;

const SidebarTitle = styled.h2`
  color: #6b4226;
  margin-bottom: 20px;
`;

const CategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  background-color: ${props => props.active ? '#8b5a2b' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#6b4226'};

  &:hover {
    background-color: ${props => props.active ? '#8b5a2b' : '#d3b08c'};
  }
`;

const CategoryItemWithDelete = styled(CategoryItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteCategoryButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.2em;
  padding: 0 5px;
  transition: color 0.3s;

  &:hover {
    color: #ff0000;
  }
`;

const AddCategoryForm = styled.form`
  display: flex;
  margin-top: 10px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #8b5a2b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6b4226;
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #d3b08c;
  border-radius: 5px;
`;

const BlogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledBlogItem = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  opacity: ${props => props.inView ? 1 : 0};
  transform: ${props => props.inView ? 'translateY(0)' : 'translateY(20px)'};
  animation: ${slideIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }

  display: flex;
  flex-direction: column;
`;

const BlogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const BlogTitle = styled.h3`
  color: #6b4226;
  margin: 0;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #8b5a2b;
  font-size: 0.9em;
  margin-bottom: 10px;
`;

const BlogDate = styled.span``;

const BlogCategory = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BlogContent = styled.p`
  color: #4a3520;
  margin-bottom: 15px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #8b5a2b;
  cursor: pointer;
  font-size: 1.2em;
  transition: color 0.3s;

  &:hover {
    color: #6b4226;
  }
`;

const EditorOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const EditorContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease-out;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #8b5a2b;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6b4226;
  }

  &:disabled {
    background-color: #d3b08c;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #6b4226;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5em;
  color: #6b4226;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
`;

export default AdminBlog;