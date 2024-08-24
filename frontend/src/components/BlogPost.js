// src/components/BlogPost.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getBlogById } from '../api/blogApi';
import Loading from './common/Loading';
import { FaTags } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(id);
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError('Failed to load the blog post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!post) return <ErrorMessage>Blog post not found.</ErrorMessage>;

  return (
    <PostContainer>
      <BackButton onClick={() => navigate('/blog')}>返回文章列表</BackButton>
      <PostContent>
        <PostTitle>{post.title}</PostTitle>
        <PostMeta>
          <PostDate>{new Date(post.date).toLocaleDateString()}</PostDate>
          <PostCategory><FaTags /> {post.category}</PostCategory>
        </PostMeta>
        <PostText dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
      </PostContent>
    </PostContainer>
  );
};

const PostContainer = styled.div`
  padding: 50px;
  background-color: #fef5e7;
`;

const PostContent = styled.div`
  background-color: #fffaf0;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PostTitle = styled.h1`
  color: #8b5e3c;
  margin-bottom: 10px;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #7a5533;
  margin-bottom: 20px;
`;

const PostDate = styled.span``;

const PostCategory = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PostText = styled.div`
  color: #7a5533;
  margin-top: 20px;
  line-height: 1.6;
`;

const BackButton = styled.button`
  background-color: #8b5a2b;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6b4226;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 20px;
`;

export default BlogPost;