import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css';
import { DefaultLayout } from './layouts/DefaultLayout';
// import { HomePage } from './pages/Home/HomePage';
import { WorkspacePage } from './pages/Workspace/WorkspacePage';
import { FileAudioPage } from './pages/FileAudio/FileAudioPage';
import { RecordPage } from './pages/Record/RecordPage';
import { FileUploadPage } from './pages/FileUpload/FileUploadPage';



function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout/>}>
          <Route path='/' element={<WorkspacePage/>} />
          {/* <Route path='/workspace' element={<WorkspacePage/>} /> */}
          <Route path='/fileAudio' element={<FileAudioPage/>} />
          <Route path='/Record' element={<RecordPage/>} />
          <Route path='/Upload' element={<FileUploadPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
