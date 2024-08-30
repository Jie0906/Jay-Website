import React from 'react';
import styled from 'styled-components';
import { FaEdit } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const BlogPost = ({ blog, onEdit }) => {
  return (
    <DetailContainer>
      <DetailHeader>
        <DetailTitle>{blog.title}</DetailTitle>
        <EditButton onClick={() => onEdit(blog)}><FaEdit /> 編輯</EditButton>
      </DetailHeader>
      <DetailMeta>
        <DetailDate>{new Date(blog.date).toLocaleDateString()}</DetailDate>
        <DetailCategory>{blog.category}</DetailCategory>
      </DetailMeta>
      <DetailContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
    </DetailContainer>
  );
};

const DetailContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailTitle = styled.h2`
  color: #6b4226;
  margin: 0;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #8b5a2b;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6b4226;
  }
`;

const DetailMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #8b5a2b;
  margin-bottom: 20px;
`;

const DetailDate = styled.span``;

const DetailCategory = styled.span``;

const DetailContent = styled.div`
  color: #4a3520;
  line-height: 1.6;
`;

export default BlogPost;