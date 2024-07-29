import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../components/Admin/AdminLogin';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminAboutMe from '../components/Admin/aboutMe/AdminAboutMe';
import AdminSkill from '../components/Admin/skill/AdminSkill'
import AdminBlog from '../components/Admin/blog/AdminBlog';
import AdminProject from '../components/Admin/project/AdminProject';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="aboutMe" element={<AdminAboutMe />} />
      <Route path="skill" element={<AdminSkill />} />
      <Route path="blog" element={<AdminBlog />} />
      <Route path="project" element={<AdminProject />} />
    </Routes>
  );
};

export default AdminRoutes;
