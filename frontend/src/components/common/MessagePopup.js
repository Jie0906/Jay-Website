import React, { createContext, useState, useContext, useCallback } from 'react';
import styled from 'styled-components';

// 創建 Context
const MessageContext = createContext();

// 消息彈出窗口組件
const MessagePopup = ({ messages, onClose }) => {
  if (!messages || messages.length === 0) return null;

  return (
    <MessageOverlay>
      <MessageContainer>
        {messages.map((msg, index) => (
          <MessageItem key={index} type={msg.type}>
            {msg.text}
          </MessageItem>
        ))}
        <CloseButton onClick={onClose}>關閉</CloseButton>
      </MessageContainer>
    </MessageOverlay>
  );
};

// Provider 組件
export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((text, type = 'info') => {
    setMessages(prev => [...prev, { text, type }]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <MessageContext.Provider value={{ addMessage, clearMessages }}>
      {children}
      <MessagePopup messages={messages} onClose={clearMessages} />
    </MessageContext.Provider>
  );
};

// 自定義 Hook 用於使用消息彈出功能
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

// 樣式組件
const MessageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const MessageContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const MessageItem = styled.p`
  margin: 0 0 15px 0;
  color: ${props => {
    switch(props.type) {
      case 'error': return '#d32f2f';
      case 'success': return '#388e3c';
      case 'warning': return '#f57c00';
      default: return '#1976d2';
    }
  }};
`;

const CloseButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 3px;
  cursor: pointer;
  float: right;

  &:hover {
    background-color: #1976d2;
  }
`;

export default MessagePopup;