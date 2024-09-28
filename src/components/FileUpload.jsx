import React from 'react';

const FileUpload = ({ type,onChange }) => {
  return (
    <div className="border-2 h-40 mt-5 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
      <input 
        type={type}
        className="hidden" 
        onChange={onChange} 
        id="file-upload"
      />
      <label htmlFor="file-upload" className="flex flex-col items-center">
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2 2 4-4m0 0l4 4 4-4m-4 4V3"
          />
        </svg>
        <span className="text-gray-600 text-lg font-medium">
          Drop your file here or click to upload
        </span>
      </label>
    </div>
  );
};

export default FileUpload;
