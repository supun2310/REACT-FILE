// src/utils/uploadToCloudinary.ts

export const uploadToCloudinary = async (pdfFile: File) => {
  const formData = new FormData();
  formData.append('file', pdfFile);
  formData.append('upload_preset', 'bookly_unsigned');

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dcmmj4egg/raw/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
