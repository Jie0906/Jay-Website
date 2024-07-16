// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCaretDown, FaSearch } from 'react-icons/fa';
import { logout } from '../api/logoutApi';

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

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #fffaf0;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const DropdownItem = styled.a`
  color: #7a5533;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;

  &:hover {
    background-color: #d48c2e;
    color: #fff;
  }
`;

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const sessionId = localStorage.getItem('sessionId');
    const storedUsername = localStorage.getItem('username');
    if (accessToken && sessionId && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const data = await logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      setUsername('');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <NavbarContainer>
      <NavLogo href="/">Jay Website</NavLogo>
      <NavItems>
        <NavLink href="/aboutMe">About me</NavLink>
        <NavLink href="/skill">Skills</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/project">Projects</NavLink>
        {isLoggedIn ? (
          <Dropdown>
            <span onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
              Hello, {username} <FaCaretDown />
            </span>
            <DropdownContent isOpen={isDropdownOpen.toString()}>
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </DropdownContent>
          </Dropdown>
        ) : (
          <NavLink href="/login">Login</NavLink>
        )}
        <SearchButton>
          <FaSearch />
        </SearchButton>
      </NavItems>
    </NavbarContainer>
  );
};

export default Navbar;
