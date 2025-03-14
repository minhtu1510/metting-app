import React, { useState, useRef } from 'react';
import recordAudio from "../../assets/Audios/audio_demo.mp3";
import recordAudio2 from "../../assets/Audios/audio_demo_2.mp3";

export const DetailMeetingPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState('00:00');
  const [showModal, setShowModal] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

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
    startTimeRef.current = new Date();
    timerRef.current = setInterval(updateTimer, 1000);
  };

  const stopRecording = () => {
    endTimeRef.current = new Date();
    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setTimer('00:00');
    setIsRecording(false);

    mediaRecorderRef.current.onstop = () => {
      const durationInSeconds = Math.floor((endTimeRef.current - startTimeRef.current) / 1000);
      const duration = new Date(durationInSeconds * 1000).toISOString().substr(11, 8);

      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);

      const newRecording = {
        id: Date.now(),
        name: `File_${new Date().toISOString()}.wav`,
        url,
        date: new Date().toLocaleDateString(),
        startTime: startTimeRef.current.toLocaleTimeString(),
        endTime: endTimeRef.current.toLocaleTimeString(),
        duration,
        location: 'Hà Nội',
        type: 'audio/wav',
        blob,
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

  const deleteRecording = (id, e) => {
    e.stopPropagation();
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      URL.revokeObjectURL(recording.url);
    }
    setRecordings((prev) => prev.filter(r => r.id !== id));
  };
  const editRecording = (id, e) => {
    e.stopPropagation();
    const recording = recordings.find(r => r.id === id);
    if (recording) {
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
      <div className='search_merge_file'>
        <div className='search_file'>
          <input type='text'></input>
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div className='search_merge_file'>
          <div className='merge_file'>
            Gộp file
          </div>
          <div className='refresh_file' >
            <i class="fa-solid fa-arrows-rotate"></i>
          </div>
        </div>
      </div>
      <h3 className="mt-4 mb-2 font-bold">Ghi Âm</h3>

      <div className="form-group">
        <button onClick={startRecording} disabled={isRecording}>Bắt đầu ghi âm</button>
        <button onClick={stopRecording} disabled={!isRecording}>Dừng ghi âm</button>
        <div className="timer">{timer}</div>
      </div>

      {showModal && (
        <div className="detail-meeting overlay">
          <div className="modal-content">
            <h3>Danh sách file ghi âm</h3>

            <div className="FileAudio__content">
              <table>
                <thead>
                  <tr>
                    <th><input type='checkbox' /></th>
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
                        <td><input type='checkbox' /></td>
                        <td>{item.name}</td>
                        <td>{item.location}</td>
                        <td>{item.startTime} - {item.endTime}</td>
                        <td>{item.duration}</td>
                        <td>
                          <div className='btn-list'>
                            <div className='btn-edit' onClick={(e) => editRecording(item.id, e)}>
                              <i className="fa-solid fa-edit"></i>
                            </div>
                            <div className='btn-download' onClick={(e) => downloadRecording(item.id, e)}>
                              <i className="fa-solid fa-download"></i>
                            </div>
                            <div className='btn-delete' onClick={(e) => deleteRecording(item.id, e)}>
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
