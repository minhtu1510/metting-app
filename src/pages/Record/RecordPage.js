
import { useState, useRef } from "react";
import microphone from "../../assets/images/microphone-only.svg"
export const RecordPage = () => {
  const [recordings, setRecordings] = useState([]); // Lưu danh sách file ghi âm
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/ogg; codecs=opus" });
        const audioUrl = URL.createObjectURL(blob); // Tạo URL tạm thời
        const newRecording = {
          id: Date.now(), // Tạo ID giả
          name: `Ghi âm ${recordings.length + 1}`,
          url: audioUrl,
        };

        setRecordings((prev) => [...prev, newRecording]); // Cập nhật danh sách
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("❌ Error accessing microphone", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = (id) => {
    setRecordings((prev) => prev.filter((rec) => rec.id !== id));
  };

  return (
    <div className="AudioRecorder">
      <div className="recordAudio">
        <img src={microphone} alt="mic"/>
        <div className="buttons">
          <button onClick={startRecording} disabled={isRecording} style={{ background: isRecording ? "red" : "" }}>
            Record
          </button>
          <button onClick={stopRecording} disabled={!isRecording}>
            Stop
          </button>
        </div>
      </div>

      {/* Danh sách file ghi âm */}
      <div className="recordings-list">
        {recordings.length === 0 ? (
          <p>Chưa có bản ghi âm nào.</p>
        ) : (
          recordings.map((rec) => (
            <div key={rec.id} className="clip">
              <audio controls src={rec.url}></audio>
              <p>{rec.name}</p>
              <button onClick={() => deleteRecording(rec.id)}>🗑️ Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
