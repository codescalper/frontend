// --------
// This is the Upload file dropzone component
// You can access the uploaded files using the state stFiles 
// Created : 15Aug2023
// --------

import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};


const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


export default function UploadFileDropzone(props) {
  const [stFiles, setStFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setStFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });
  
  const thumbs = stFiles.map(file => (
    <div className='' key={file.name}>
      <div className='border border-dashed border-gray-300 p-1'>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => stFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (<>
  
    <section className="p-4 rounded-lg border border-dashed border-blue-500 cursor-pointer">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop, or Click to browse files</p>
      </div>
   
    </section>    
    <aside style={thumbsContainer}>
        {thumbs}
      </aside>
  
    </>);
}

