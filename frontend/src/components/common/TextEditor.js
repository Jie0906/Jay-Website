// src/components/common/TextEditor.js
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled, { keyframes } from 'styled-components';

const TextEditor = ({ initialData, onSave, onCancel, fields = [], useFormData = false  }) => {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    let dataToSave = { ...formData };
    
    if (file) {
      // 如果有文件，使用 FormData
      const formDataToSend = new FormData();
      Object.keys(dataToSave).forEach(key => {
        formDataToSend.append(key, dataToSave[key]);
      });
      formDataToSend.append('image', file);
      onSave(formDataToSend, true);
    } else {
      // 否則使用普通對象
      onSave(dataToSave, false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'date':
        return (
          <Input
            key={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      case 'select':
        return (
          <Select
            key={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">{field.placeholder}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        );
      case 'content':
        return (
          <StyledReactQuill
            key={field.name}
            value={formData[field.name] || ''}
            onChange={(value) => handleChange(field.name, value)}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['link', 'image'],
                ['clean']
              ],
            }}
            placeholder={field.placeholder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <EditorContainer>
      {fields.map(renderField)}
      <FileInput
        type="file"
        onChange={handleFileChange}
        accept="image/*"
      />
      <ButtonGroup>
        <SaveButton onClick={handleSave}>保存</SaveButton>
        <CancelButton onClick={onCancel}>取消</CancelButton>
      </ButtonGroup>
    </EditorContainer>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const EditorContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #d48c2e;
  border-radius: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #d48c2e;
  border-radius: 5px;
`;

const StyledReactQuill = styled(ReactQuill)`
  .ql-container {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .ql-editor {
    min-height: 200px;
    transition: background-color 0.3s ease;

    &:focus {
      background-color: #f9f9f9;
    }
  }

  .ql-toolbar {
    background-color: #f3f3f3;
    border-bottom: 1px solid #e0e0e0;
  }
`;

const FileInput = styled.input`
  margin: 10px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const SaveButton = styled(Button)`
  background-color: #4caf50;
  color: white;
  &:hover { background-color: #45a049; }
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
  color: white;
  &:hover { background-color: #da190b; }
`;

export default TextEditor;