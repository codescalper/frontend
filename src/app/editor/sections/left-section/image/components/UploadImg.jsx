import React, { useState } from 'react';

const UploadImg = () => {

  const [imageBase64, setImageBase64] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // When the file has been read successfully, the result will be a Base64 encoded string
        const base64String = reader.result;
        setImageBase64(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {imageBase64 && (
        <div>
          <p>Base64 Encoded Image:</p>
          <img src={imageBase64} alt="Uploaded" />
        </div>
      )}
    </div>
  );
}

export default UploadImg;
