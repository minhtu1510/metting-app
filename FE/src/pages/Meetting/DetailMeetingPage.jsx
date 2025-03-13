import React, { useState, useRef } from 'react';
export const DetailMeetingPage = () => {
    const [recordings, setRecordings] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState('00:00');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
  
    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      setIsRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(updateTimer, 1000);
    };
  
    const stopRecording = () => {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setTimer('00:00');
      setIsRecording(false);
  
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const newRecording = {
          name: `File_${new Date().toISOString()}.wav`,
          url,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        };
        setRecordings((prev) => [...prev, newRecording]);
      };
    };
  
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const seconds = String(elapsed % 60).padStart(2, '0');
      setTimer(`${minutes}:${seconds}`);
    };
  
    const filteredRecordings = recordings.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const deleteRecording = (url) => {
      setRecordings(recordings.filter(r => r.url !== url));
    };
  
    return (
      <div className="detail-meeting container">
        <button className="file-button" onClick={() => setShowModal(true)}>
          File ghi âm
        </button>
        <h2 className="text-xl font-bold mb-4">Chi Tiết Cuộc Họp</h2>
        <div className="info-item"><span className="info-label">Tên cuộc họp:</span> Cuộc họp ABC</div>
        <div className="info-item"><span className="info-label">Chủ tọa:</span> Nguyễn Văn A</div>
  
        <h3 className="mt-4 mb-2 font-bold">Ghi Âm</h3>
        <div className="form-group">
          <button onClick={startRecording} disabled={isRecording}>
            Bắt đầu ghi âm
          </button>
          <button onClick={stopRecording} disabled={!isRecording}>
            Dừng ghi âm
          </button>
          <div className="timer">{timer}</div>
        </div>
  
        {showModal && (
          <div className="detail-meeting overlay">
            <div className="modal-content">
              <h3>Danh sách file ghi âm</h3>
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <div className="recordings">
                {filteredRecordings.map((recording, index) => (
                  <div key={index} className="recording-item">
                    <div><strong>{recording.name}</strong></div>
                    <div>Ngày: {recording.date}</div>
                    <div>Thời gian: {recording.time}</div>
                    <audio controls src={recording.url} />
                    <button onClick={() => deleteRecording(recording.url)} className="delete-button">
                      Xoá
                    </button>
                    <a href={recording.url} download className="download-button">
                      Tải về
                    </a>
                  </div>
                ))}
                {filteredRecordings.length === 0 && <p>Không có file nào.</p>}
              </div>
              <button className="close-button" onClick={() => setShowModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };