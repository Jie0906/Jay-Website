import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaTags } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { fetchBlogs } from '../api/blogApi';
import Loading from './common/Loading';
import DOMPurify from 'dompurify';
import { debounce } from 'lodash';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['全部', '技術筆記', '刷題心得']);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const fetchAllBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBlogs(page, limit, search);
      setBlogs(data.posts || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearch(term);
      setPage(1);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const filteredBlogs = selectedCategory === '全部' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  if (loading && blogs.length === 0) {
    return <Loading />;
  }

  return (
    <BlogContainer>
      <BlogHeader>
        <HeaderTitle>部落格</HeaderTitle>
        <HeaderUnderline />
      </BlogHeader>
      <ContentWrapper>
        <Sidebar>
          <SidebarTitle>文章分類</SidebarTitle>
          <CategoryList>
            {categories.map(category => (
              <CategoryItem 
                key={category} 
                active={selectedCategory === category}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </CategoryItem>
            ))}
          </CategoryList>
        </Sidebar>
        <MainContent>
          <SearchBar>
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="搜索文章..."
            />
          </SearchBar>
          <BlogList>
            {filteredBlogs.map(blog => (
              <BlogItem 
                key={blog._id} 
                blog={blog}
                onClick={() => navigate(`/blog/${blog._id}`)}
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
      </ContentWrapper>
    </BlogContainer>
  );
};

const BlogItem = ({ blog, onClick }) => {
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
    <StyledBlogItem ref={ref} inView={inView} onClick={onClick}>
      <BlogTitle>{blog.title}</BlogTitle>
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

const expandWidth = keyframes`
  from { width: 0; }
  to { width: 100px; }
`;

const BlogContainer = styled.div`
  min-height: 100vh;
  background-color: #f5e5d3;
`;

const BlogHeader = styled.div`
  text-align: center;
  padding: 50px 0 30px;
  background-color: #e6c9a8;
`;

const HeaderTitle = styled.h1`
  color: #6b4226;
  font-size: 2.5rem;
  margin-bottom: 10px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeaderUnderline = styled.div`
  height: 3px;
  background-color: #8b5e3c;
  width: 100px;
  margin: 0 auto;
  animation: ${expandWidth} 0.8s ease-out forwards;
`;

const ContentWrapper = styled.div`
  display: flex;
  padding: 20px;
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 20px;
  background-color: #fffaf0;
  border-radius: 8px;
  margin-right: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #fffaf0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
`;

const BlogTitle = styled.h3`
  color: #6b4226;
  margin: 0 0 10px 0;
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

export default Blog;