// src/components/common/TextEditor.js
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';

const TextEditor = ({ value, onChange }) => {
  return (
    <StyledReactQuill
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link', 'image'],
          ['clean']
        ],
      }}
    />
  );
};

const StyledReactQuill = styled(ReactQuill)`
  .ql-editor {
    min-height: 200px;
  }
`;

export default TextEditor;