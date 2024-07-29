import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaUndo, FaTags } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { fetchBlogs, createBlog, updateBlog, deleteBlog, restoreBlog } from '../../../api/blogApi';
import TextEditor from '../../../components/common/TextEditor';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['技術', '生活', '旅行', '學習']);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      const data = await fetchBlogs();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRestore = async (id) => {
    try {
      const restoredBlog = await restoreBlog(id);
      setBlogs([...blogs, restoredBlog]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSave = async (blogData) => {
    try {
      if (editingBlog) {
        const updatedBlog = await updateBlog(editingBlog._id, blogData);
        setBlogs(blogs.map(blog => 
          blog._id === editingBlog._id ? updatedBlog : blog
        ));
      } else {
        const newBlog = await createBlog(blogData);
        setBlogs([...blogs, newBlog]);
      }
      setIsEditing(false);
      setEditingBlog(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredBlogs = selectedCategory === '全部' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  if (loading) return <LoadingScreen>Loading...</LoadingScreen>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <AdminContainer>
      <Sidebar>
        <SidebarTitle>Blog管理</SidebarTitle>
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
        <AddButton onClick={() => setIsEditing(true)}>
          <FaPlus /> 新增文章
        </AddButton>
      </Sidebar>
      <MainContent>
        <BlogList>
          {filteredBlogs.map(blog => (
            <BlogItem key={blog._id} blog={blog} onEdit={handleEdit} onDelete={handleDelete} onRestore={handleRestore} />
          ))}
        </BlogList>
      </MainContent>
      {isEditing && (
        <EditorOverlay>
          <EditorContainer>
            <BlogEditor 
              blog={editingBlog} 
              categories={categories}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setEditingBlog(null);
              }}
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

  return (
    <StyledBlogItem ref={ref} inView={inView}>
      <BlogTitle>{blog.title}</BlogTitle>
      <BlogMeta>
        <BlogDate>{new Date(blog.date).toLocaleDateString()}</BlogDate>
        <BlogCategory><FaTags /> {blog.category}</BlogCategory>
      </BlogMeta>
      <BlogContent>{blog.content.substring(0, 150)}...</BlogContent>
      <ActionButtons>
        <ActionButton onClick={() => onEdit(blog)}><FaEdit /></ActionButton>
        {blog.deleted ? (
          <ActionButton onClick={() => onRestore(blog._id)}><FaUndo /></ActionButton>
        ) : (
          <ActionButton onClick={() => onDelete(blog._id)}><FaTrash /></ActionButton>
        )}
      </ActionButtons>
    </StyledBlogItem>
  );
};

const BlogEditor = ({ blog, categories, onSave, onCancel }) => {
  const [editedBlog, setEditedBlog] = useState(blog || { title: '', content: '', category: categories[0], date: new Date() });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setEditedBlog(prev => ({ ...prev, content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedBlog);
  };

  return (
    <EditorForm onSubmit={handleSubmit}>
      <Input
        type="text"
        name="title"
        value={editedBlog.title}
        onChange={handleInputChange}
        placeholder="標題"
        required
      />
      <Select name="category" value={editedBlog.category} onChange={handleInputChange}>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>
      <TextEditor value={editedBlog.content} onChange={handleContentChange} />
      <ButtonGroup>
        <SubmitButton type="submit">保存</SubmitButton>
        <CancelButton type="button" onClick={onCancel}>取消</CancelButton>
      </ButtonGroup>
    </EditorForm>
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

const BlogList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
`;

const BlogTitle = styled.h3`
  color: #6b4226;
  margin-bottom: 10px;
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

const EditorForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d3b08c;
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #d3b08c;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const SubmitButton = styled(Button)`
  background-color: #8b5a2b;
  color: white;

  &:hover {
    background-color: #6b4226;
  }
`;

const CancelButton = styled(Button)`
  background-color: #d3b08c;
  color: #4a3520;

  &:hover {
    background-color: #c19a6b;
  }
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