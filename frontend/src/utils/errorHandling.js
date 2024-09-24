import React, { createContext, useState, useContext } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);

export const triggerErrorPage = (status) => {
  const { setError } = useError();
  setError(status);
};

export const ErrorBoundary = () => {
  const { error } = useError();

  if (error === 404) {
    return <NotFoundPage />;
  }
  if (error === 500) {
    return <ServerErrorPage />;
  }

  return null;
};

const NotFoundPage = () => <div>404 - Page Not Found</div>;
const ServerErrorPage = () => <div>500 - Server Error</div>;