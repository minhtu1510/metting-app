import { useState, useRef } from "react";

export const RecordPage = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Chỉ định `audio/webm` vì `audio/wav` KHÔNG HỖ TRỢ
    mediaRecorder.current = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
        sendPartialData(event.data);
      }
    };

    mediaRecorder.current.start(3000); // Cắt file mỗi 3 giây
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }

    // Gửi phần còn lại nếu có
    setTimeout(() => {
      if (audioChunks.current.length > 0) {
        console.log("Gửi phần còn lại...");
        sendPartialData(audioChunks.current[audioChunks.current.length - 1]);
        audioChunks.current = [];
      }
    }, 500);
  };

  const sendPartialData = (audioBlob) => {
    if (!audioBlob) return;
    
    const formData = new FormData();
    formData.append("file", audioBlob, "partial_audio.webm");  // Lưu file dưới dạng .webm

    fetch("http://localhost:8000/api/audio/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("Đã gửi phần âm thanh:", data))
      .catch((error) => console.error("Lỗi gửi audio:", error));
  };

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording}>Bắt đầu ghi âm</button>
      ) : (
        <button onClick={stopRecording}>Dừng ghi âm</button>
      )}
    </div>
  );
};


