import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css';
import { DefaultLayout } from './layouts/DefaultLayout';
// import { HomePage } from './pages/Home/HomePage';
import { WorkspacePage } from './pages/Meetting/WorkspacePage.jsx';
import {UserPage } from './pages/User/UserPage.js';
import {RecordPage } from './pages/Record/RecordPage.js';
import { WordPage } from './pages/Word/WordPage.js';
// import { CreatePage } from './pages/Meetting/Create.jsx';

import { CreatePage } from './pages/Meetting/CreatePage.jsx';
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout/>}>
          <Route path='/' element={<WorkspacePage/>} />
          {/* <Route path='/workspace' element={<WorkspacePage/>} /> */}
          <Route path='/user' element={<UserPage/>} />
          <Route path='/Record' element={<RecordPage/>} />
          <Route path='/word' element={<WordPage/>} />
          <Route path='/meeting/create' element={<CreatePage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
