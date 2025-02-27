// export const uploadAudio = async (blob, fileName) => {
//     const formData = new FormData();
//     formData.append("file", blob, fileName);
  
//     try {
//       const response = await fetch("http://localhost:8000/upload-audio/", {
//         method: "POST",
//         body: formData,
//       });
  
//       const data = await response.json();
//       return data.url; // Trả về URL của file trên server
//     } catch (error) {
//       console.error("Upload failed", error);
//       return null;
//     }
//   };
//   export const deleteAudio = async (fileName) => {
//     try {
//       const response = await fetch("http://localhost:8000/upload-audio/?", {
//         method: "POST",
//         body: formData,
//       });
  
//       const data = await response.json();
//       return data.url; // Trả về URL của file trên server
//     } catch (error) {
//       console.error("Upload failed", error);
//       return null;
//     }
//   };
export const uploadAudio = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "recording.ogg"); // Không cần quan tâm tên file
  
    try {
      const response = await fetch("http://localhost:3000/upload-audio/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      return { url: data.url, slug: data.slug }; // Trả về URL và Slug
    } catch (error) {
      console.error("Upload failed", error);
      return null;
    }
  };
// export const uploadAudio = async (blob) => {
//     const formData = new FormData();
//     formData.append("file", blob, "recording.ogg");
  
//     console.log("📌 Đang gửi file lên server:", formData);
  
//     try {
//       const response = await fetch("http://localhost:3000/upload-audio/", {
//         method: "POST",
//         body: formData,
//       });
  
//       const data = await response.json();
//       console.log("📌 Upload Response:", data);
//       return data;
//     } catch (error) {
//       console.error("❌ Upload failed:", error);
//       return null;
//     }
//   };
  
  export const deleteAudio = async (slug) => {
    try {
      const response = await fetch(`http://localhost:3000/delete-audio/?file_name=${slug}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Delete failed", error);
      return null;
    }
  };
  