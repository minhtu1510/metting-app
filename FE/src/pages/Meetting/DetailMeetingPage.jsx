import React, { useState, useRef } from 'react';
import { MicVAD } from "@ricky0123/vad-web";

export const DetailMeetingPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState('00:00');
  const [showModal, setShowModal] = useState(false);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const speechStartTimeRef = useRef(null);
  const directoryHandleRef = useRef(null);
  const segmentCountRef = useRef(0);
  const vadRef = useRef(null);
  const audioBufferRef = useRef([]);
  const overlapDuration = 1; // 1 giây overlap

  // Hàm chuyển Float32Array thành WAV Blob
  const float32ToWavBlob = (float32Array, sampleRate) => {
    const buffer = new ArrayBuffer(44 + float32Array.length * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const numChannels = 1;
    const byteRate = sampleRate * numChannels * 2; // 16-bit mono
    const blockAlign = numChannels * 2;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + float32Array.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, float32Array.length * 2, true);

    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const saveRecording = async (blob, filename) => {
    try {
      if (!directoryHandleRef.current) {
        console.error("Chưa có quyền truy cập thư mục");
        return;
      }
      const fileHandle = await directoryHandleRef.current.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      console.log(`Đã lưu file: ${filename}`);
    } catch (error) {
      console.error("Không thể lưu file:", error);
    }
  };

  const saveSegment = async (audio) => {
    if (!audio || audio.length === 0) {
      console.log("Không có dữ liệu giọng nói để lưu");
      return;
    }

    segmentCountRef.current += 1;
    const blob = float32ToWavBlob(audio, 16000); // Chuyển Float32Array thành WAV
    const filename = `Segment_${segmentCountRef.current}_${Date.now()}.wav`;
    await saveRecording(blob, filename);

    const url = URL.createObjectURL(blob);
    setRecordings(prev => [...prev, {
      id: Date.now(),
      name: `Recording_${segmentCountRef.current}`,
      url,
      type: "audio/wav",
      location: "Phòng họp 101",
      startTime: new Date(startTimeRef.current).toLocaleTimeString(),
      endTime: new Date().toLocaleTimeString(),
      duration: timer
    }]);
    console.log("Đã lưu đoạn nói vào folder");
  };

  const startRecording = async () => {
    if (isRecording) return;
  
    try {
      if (!directoryHandleRef.current) {
        directoryHandleRef.current = await window.showDirectoryPicker();
        console.log("Đã chọn thư mục để lưu file");
      }
  
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(streamRef.current);
      const overlapDuration = 1; // 1 giây overlap
      const segmentDuration = 5; // 5 giây mỗi đoạn
  
      vadRef.current = await MicVAD.new({
        source,
        sampleRate: 16000,
        frameDuration: 30,
        onSpeechStart: () => {
          console.log("Phát hiện giọng nói...");
          speechStartTimeRef.current = Date.now();
        },
        onSpeechEnd: (audio) => {
          console.log("Ngừng nói, dữ liệu âm thanh:", audio);
          if (!audio || !(Array.isArray(audio) || audio instanceof Float32Array)) {
            console.warn("Dữ liệu audio không hợp lệ:", audio);
            return;
          }
  
          const sampleRate = 16000;
          const totalDuration = audio.length / sampleRate; // Thời gian tổng (giây)
          const overlapSamples = overlapDuration * sampleRate;
          const segmentSamples = segmentDuration * sampleRate;
  
          if (totalDuration <= segmentDuration) {
            // Nếu dưới hoặc bằng 5 giây, lưu nguyên đoạn
            saveSegment(audio);
          } else {
            // Nếu trên 5 giây, cắt thành các đoạn với overlap
            let startIndex = 0;
            while (startIndex < audio.length) {
              const endIndex = Math.min(startIndex + segmentSamples + overlapSamples, audio.length);
              const segment = audio.slice(startIndex, endIndex);
  
              if (segment.length > 0) {
                saveSegment(segment, startIndex > 0); // isPartial = true nếu không phải đoạn đầu
              }
  
              startIndex += segmentSamples; // Chuyển sang đoạn tiếp theo, bỏ qua overlap
            }
          }
  
          speechStartTimeRef.current = null;
        },
      });
  
      setIsRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(updateTimer, 1000);
  
      vadRef.current.start();
      console.log("Đã bắt đầu ghi âm...");
    } catch (error) {
      console.error("Lỗi khi bắt đầu ghi âm:", error);
      setIsRecording(false);
    }
  };
  const stopRecording = async () => {
    if (!isRecording) return;

    setIsRecording(false);
    clearInterval(timerRef.current);
    setTimer("00:00");
    timerRef.current = null;

    if (vadRef.current) {
      vadRef.current.pause(); // Tạm dừng VAD
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    console.log("Đã dừng ghi âm");
  };

  const updateTimer = () => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    setTimer(`${minutes}:${seconds}`);
  };

  const deleteRecording = (id, e) => {
    e.stopPropagation();
    setRecordings(prev => {
      const recording = prev.find(r => r.id === id);
      if (recording) URL.revokeObjectURL(recording.url);
      return prev.filter(r => r.id !== id);
    });
  };

  const editRecording = (id, e) => {
    e.stopPropagation();
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      console.log('Chỉnh sửa:', recording);
    }
  };

  const downloadRecording = (id, e) => {
    e.stopPropagation();
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      const link = document.createElement('a');
      link.href = recording.url;
      link.download = recording.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const [visitableRow, setVisitableRow] = useState(null);
  const toggleAudio = (id) => {
    setVisitableRow(visitableRow === id ? null : id);
  };

  return (
    <div className="detail-meeting container">
      <button className="file-button" onClick={() => setShowModal(true)}>File ghi âm</button>
      <h2 className="text-xl font-bold mb-4">Chi Tiết Cuộc Họp</h2>
      <div className="mb-2"><strong>Tên cuộc họp:</strong> Cuộc họp ABC</div>
      <div className="mb-2"><strong>Chủ tọa:</strong> Nguyễn Văn A</div>
      <div className="mb-2"><strong>Số lượng thành viên:</strong> 10</div>
      <div className="mb-2"><strong>Địa điểm:</strong> Phòng họp 101</div>
      <div className="mb-2"><strong>Ngày:</strong> 12/03/2025</div>
      <div className="mb-2"><strong>Thời gian:</strong> 09:00 AM</div>
      <div className="mb-2"><strong>Mô tả:</strong> Cuộc họp thảo luận về kế hoạch kinh doanh.</div>
      <h3 className="mt-4 mb-2 font-bold">Ghi Âm</h3>

      <div className="form-group">
        <button onClick={startRecording} disabled={isRecording}>Bắt đầu ghi âm</button>
        <button onClick={stopRecording} disabled={!isRecording}>Dừng ghi âm</button>
        <div className="timer">{timer}</div>
      </div>

      {showModal && (
        <div className="detail-meeting overlay">
          <div className="modal-content">
            <div className="search_merge_file">
              <div className="search_file">
                <input type="text" placeholder="Tìm kiếm" />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <div className="search_merge_file">
                <div className="merge_file">Gộp file</div>
                <div className="refresh_file">
                  <i className="fa-solid fa-arrows-rotate"></i>
                </div>
              </div>
            </div>
            <h3>Danh sách file ghi âm</h3>

            <div className="FileAudio__content">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>File</th>
                    <th>Địa điểm</th>
                    <th>Thời gian</th>
                    <th>Thời lượng</th>
                    <th>Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {recordings.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr onClick={() => toggleAudio(item.id)}>
                        <td><input type="checkbox" /></td>
                        <td>{item.name}</td>
                        <td>{item.location}</td>
                        <td>{item.startTime} - {item.endTime}</td>
                        <td>{item.duration}</td>
                        <td>
                          <div className="btn-list">
                            <div className="btn-edit" onClick={(e) => editRecording(item.id, e)}>
                              <i className="fa-solid fa-edit"></i>
                            </div>
                            <div className="btn-download" onClick={(e) => downloadRecording(item.id, e)}>
                              <i className="fa-solid fa-download"></i>
                            </div>
                            <div className="btn-delete" onClick={(e) => deleteRecording(item.id, e)}>
                              <i className="fa-solid fa-trash"></i>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {visitableRow === item.id && (
                        <tr className="audioBox">
                          <td colSpan="6" className="audio-row">
                            <audio controls className="audio">
                              <source src={item.url} type={item.type} />
                              Trình duyệt không hỗ trợ audio
                            </audio>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="close-button" onClick={() => setShowModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};