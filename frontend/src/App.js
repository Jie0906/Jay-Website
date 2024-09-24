// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorProvider, ErrorBoundary } from './utils/errorHandling';
import { MessageProvider } from './components/common/MessagePopup';
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <ErrorProvider>
      <MessageProvider>
        <Router>
          <ErrorBoundary />
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/*" element={<PublicRoutes />} />
          </Routes>
        </Router>
      </MessageProvider>
    </ErrorProvider>
  );
}

export default App;