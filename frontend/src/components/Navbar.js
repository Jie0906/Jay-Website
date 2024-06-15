// src/components/Navbar.js
import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  background-color: #fffaf0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavLogo = styled.a`
  font-size: 1.5rem;
  font-weight: bold;
  color: #d48c2e;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #7a5533;
  }
`;

const NavItems = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #7a5533;
  font-size: 1rem;
  padding: 10px;
  transition: color 0.3s ease;

  &:hover {
    color: #d48c2e;
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #7a5533;
  font-size: 1.5rem;
  padding: 10px;
  transition: color 0.3s ease;

  &:hover {
    color: #d48c2e;
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <NavLogo href="/">Jay Website</NavLogo>
      <NavItems>
        <NavLink href="/about">About me</NavLink>
        <NavLink href="/skills">Skills</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/projects">Projects</NavLink>
        <SearchButton>
          <FaSearch />
        </SearchButton>
      </NavItems>
    </NavbarContainer>
  );
};

export default Navbar;
