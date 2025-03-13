import React, { useState, useRef } from 'react';
import recordAudio from "../../assets/Audios/audio_demo.mp3"
import recordAudio2 from "../../assets/Audios/audio_demo_2.mp3"

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
      setShowModal(true);
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

  const [visitableRow, setVisitableRow] = useState(null);
  const data = [
    { id: 1, name: 'Nguyễn Văn A', date: '12/12/2025', rank: 'Thượng úy', position: 'Chủ nhiệm chính trị', audio: recordAudio },
    { id: 2, name: 'Nguyễn Văn B', date: '01/01/2026', rank: 'Thiếu tá', position: 'Trưởng phòng nhân sự', audio: recordAudio2 },
    ...recordings.map((recording, index) => ({
      id: recordings.length + index + 1,
      name: recording.name,
      date: recording.date,
      rank: '-',
      position: '-',
      audio: recording.url
    }))
  ];

  const toggleAudio = (id) => {
    setVisitableRow(visitableRow === id ? null : id);
  }

  return (
    <div className="detail-meeting container">
      <button className="file-button" onClick={() => setShowModal(true)}>File ghi âm</button>
      <h2 className="text-xl font-bold mb-4">Chi Tiết Cuộc Họp</h2>
      <div className="info-item"><span className="info-label">Tên cuộc họp:</span> Cuộc họp ABC</div>
      <div className="info-item"><span className="info-label">Chủ tọa:</span> Nguyễn Văn A</div>

      <h3 className="mt-4 mb-2 font-bold">Ghi Âm</h3>
      <div className="form-group">
        <button onClick={startRecording} disabled={isRecording}>Bắt đầu ghi âm</button>
        <button onClick={stopRecording} disabled={!isRecording}>Dừng ghi âm</button>
        <div className="timer">{timer}</div>
      </div>

      {showModal && (
        <div className="detail-meeting overlay">
          <div className="modal-content">
            <div className="modal-content--title">
              <h3>Danh sách file ghi âm</h3>
              <div className='btn-merge-file'>Gộp file</div>
            </div>

            <div className="FileAudio__content">
              <table>
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Tên</th>
                    <th>Tạo</th>
                    <th>Cấp bậc</th>
                    <th>Chức vụ</th>
                    <th>Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr onClick={() => toggleAudio(item.id)}>
                        <td><input type="checkbox" /></td>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                        <td>{item.rank}</td>
                        <td>{item.position}</td>
                        <td>
                          <button className="btn btn-edit">Sửa</button>
                          <button className="btn btn-delete">Xóa</button>
                        </td>
                      </tr>
                      {visitableRow === item.id && (
                        <tr className="audioBox">
                          <td colSpan="6" className="audio-row">
                            <audio controls className="audio">
                              <source src={item.audio} type="audio/mp3" />
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
