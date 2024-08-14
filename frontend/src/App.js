// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MessageProvider } from './components/common/MessagePopup';
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <MessageProvider>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </Router>
    </MessageProvider>
  );
}

export default App;