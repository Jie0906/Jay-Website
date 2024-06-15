// src/components/BlogPost.js
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

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
`;

const PostDate = styled.p`
  color: #7a5533;
`;

const PostText = styled.p`
  color: #7a5533;
  margin-top: 20px;
`;

const BlogPost = () => {
  const { id } = useParams();

  return (
    <PostContainer>
      <PostContent>
        <PostTitle>Title {id}</PostTitle>
        <PostDate>發布日期</PostDate>
        <PostText>
          這是文章 {id} 的完整內容...
        </PostText>
      </PostContent>
    </PostContainer>
  );
};

export default BlogPost;
