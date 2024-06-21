// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutMe from './components/AboutMe';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Projects from './components/Projects';
import Skills from './components/Skills';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutMe" element={<AboutMe />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/skill" element={<Skills />} />
        {/* 添加其他路由 */}
      </Routes>
    </Router>
  );
}

export default App;
