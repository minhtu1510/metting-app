export const HomePage = () => {
    return (
        <>
        <h1>Trang chu</h1>

{/*         startTime: startTimeRef.current.toLocaleTimeString(),
        endTime: endTimeRef.current.toLocaleTimeString(),


              const durationInSeconds = Math.floor((endTimeRef.current - startTimeRef.current) / 1000);
      const duration = new Date(durationInSeconds * 1000).toISOString().substr(11, 8);

              startTime: startTimeRef.current.toLocaleTimeString(),
        endTime: endTimeRef.current.toLocaleTimeString(),
        duration,

        

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
      id: Date.now(),
      name: `File_${new Date().toISOString()}.wav`,
      url,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      location: 'Hà Nội', // Địa điểm mặc định
      type: 'audio/wav',
      blob,
      downloadType: 'wav',
    };
    setRecordings((prev) => [...prev, newRecording]);
    setShowModal(true);
  };
};
const timerRef = useRef(null);
const startTimeRef = useRef(null);
const updateTimer = () => {
  const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  setTimer(`${minutes}:${seconds}`);
};
<td>{item.name}</td>
<td>{item.location}</td>
<td>{`${item.date} ${item.time}`}</td>
<td>
  <select value={item.downloadType} onChange={(e) => handleDownloadTypeChange(item.id, e.target.value)}>
    <option value="wav">WAV</option>
    <option value="mp3">MP3</option>
  </select>
</td> */}
        </>
    )
}