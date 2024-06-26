// src/components/Blog.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaShareAlt, FaHeart, FaComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import ReactPaginate from 'react-paginate';
import { fetchBlogs } from '../api/blogApi';

const PostItem = ({ post }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <Post ref={ref} inView={inView} key={post._id}>
      <PostHeader>
        <PostTitle to={`/blog/${post._id}`}>{post.title}</PostTitle>
        <PostDate>{new Date(post.date).toLocaleDateString()}</PostDate>
      </PostHeader>
      <PostContent>{post.content}</PostContent>
      <PostFooter>
        <IconButton><FaShareAlt /></IconButton>
        <IconButton><FaHeart /></IconButton>
        <IconButton><FaComment /></IconButton>
      </PostFooter>
    </Post>
  );
};

const Blog = () => {
  const postsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  const pageCount = Math.ceil(posts.length / postsPerPage);
  const displayPosts = posts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <BlogContainer>
      <Sidebar>
        <SidebarTitle>分類</SidebarTitle>
        <CategoryList>
          <CategoryItem>技術</CategoryItem>
          <CategoryItem>生活</CategoryItem>
          <CategoryItem>旅行</CategoryItem>
          <CategoryItem>學習</CategoryItem>
        </CategoryList>
      </Sidebar>
      <Content>
        {displayPosts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
        <PaginateContainer>
          <ReactPaginate
            previousLabel={'上一頁'}
            nextLabel={'下一頁'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
          />
        </PaginateContainer>
      </Content>
    </BlogContainer>
  );
};
const BlogContainer = styled.div`
  display: flex;
  padding: 50px;
  background-color: #fef5e7;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 20%;
  padding: 20px;
  background-color: #fffaf0;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
`;

const SidebarTitle = styled.h2`
  color: #8b5e3c;
`;

const CategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li`
  padding: 10px 0;
  font-size: 1.2rem;
  color: #7a5533;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #d48c2e;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Post = styled.div`
  background-color: #fffaf0;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: ${({ inView }) => (inView ? 1 : 0)};
  transform: ${({ inView }) => (inView ? 'none' : 'translateY(100px)')};
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostTitle = styled(Link)`
  margin: 0;
  color: #8b5e3c;
  text-decoration: none;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #d48c2e;
  }
`;

const PostDate = styled.span`
  color: #7a5533;
`;

const PostContent = styled.p`
  color: #7a5533;
  margin: 20px 0;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #7a5533;
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #d48c2e;
  }
`;

const PaginateContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;

  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination li a {
    color: #8b5e3c;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid #8b5e3c;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .pagination li a:hover {
    background-color: #8b5e3c;
    color: #fff;
  }

  .pagination li.active a {
    background-color: #8b5e3c;
    color: #fff;
  }

  .pagination li.disabled a {
    color: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
  }
`;

export default Blog;
