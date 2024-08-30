import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Home from '../components/Home';
import AboutMe from '../components/AboutMe';
import Blog from '../components/Blog';
import BlogPost from '../components/BlogPost';
import Projects from '../components/Projects';
import Skills from '../components/Skills';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/aboutMe" element={<AboutMe />} />
        <Route path="/skill" element={<Skills />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/project" element={<Projects />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
