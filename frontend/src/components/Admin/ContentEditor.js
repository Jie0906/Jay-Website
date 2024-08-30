import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const ContentEditor = () => {
  const [content, setContent] = useState('');

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/save-content', { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Content saved!');
  };

  return (
    <div>
      <ReactQuill value={content} onChange={setContent} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ContentEditor;
