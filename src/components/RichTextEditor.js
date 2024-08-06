// src/components/RichTextEditor.js
"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid issues with server-side rendering
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const RichTextEditor = ({ value, onChange }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'align': [] }],
          ['link'],
          [{ 'color': [] }, { 'background': [] }],
          ['clean'] // remove formatting button
        ],
      }}
    />
  );
};

export default RichTextEditor;
