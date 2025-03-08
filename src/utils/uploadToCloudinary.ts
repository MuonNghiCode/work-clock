export const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
  
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data.secure_url; // Trả về URL ảnh
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };
  