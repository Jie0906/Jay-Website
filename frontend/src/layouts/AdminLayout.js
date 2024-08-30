// src/components/layouts/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import styled from 'styled-components';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const AdminContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #f5e5d3;
`;

const AdminLayout = () => {
  return (
    <AdminContainer>
      <AdminSidebar />
      <AdminContent>
        <Outlet />
      </AdminContent>
    </AdminContainer>
  );
};

export default AdminLayout;