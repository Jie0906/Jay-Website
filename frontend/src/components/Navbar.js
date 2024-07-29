// src/components/Navbar.js
import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 0;
  background-color: #fffaf0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease-out;
`;

const NavLogo = styled.a`
  font-size: 1.8rem;
  font-weight: bold;
  color: #d48c2e;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #7a5533;
    transform: scale(1.05);
  }
`;

const NavItems = styled.div`
  display: flex;
  gap: 25px;
  align-items: center;
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #7a5533;
  font-size: 1.1rem;
  padding: 10px;
  transition: all 0.3s ease;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background-color: #d48c2e;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #d48c2e;
    transform: translateY(-2px);
    
    &:after {
      width: 100%;
      left: 0;
    }
  }
`;

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const height = navRef.current.offsetHeight;
      document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    }
  }, []);

  return (
    <NavbarContainer ref={navRef}>
      <NavLogo href="/">Jay Website</NavLogo>
      <NavItems>
        <NavLink href="/aboutMe">About me</NavLink>
        <NavLink href="/skill">Skills</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/project">Projects</NavLink>
      </NavItems>
    </NavbarContainer>
  );
};

export default Navbar;