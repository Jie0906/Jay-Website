// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';
import { FaLine, FaInstagram, FaGithub, FaPhone, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #eaeaea;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const IconLink = styled.a`
  color: #000;
  font-size: 2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <IconContainer>
        <IconLink href="https://line.me/" target="_blank" rel="noopener noreferrer">
          <FaLine />
        </IconLink>
        <IconLink href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </IconLink>
        <IconLink href="https://github.com/" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </IconLink>
      </IconContainer>
      <ContactInfo>
        <InfoItem>
          <FaPhone />
          <span>+886 975206512</span>
        </InfoItem>
        <InfoItem>
          <FaEnvelope />
          <span>eugene605110@gmail.com</span>
        </InfoItem>
      </ContactInfo>
    </FooterContainer>
  );
};

export default Footer;
