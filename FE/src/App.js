import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css';
import { DefaultLayout } from './layouts/DefaultLayout';
// import { HomePage } from './pages/Home/HomePage';
import { WorkspacePage } from './pages/Meetting/WorkspacePage.jsx';
import {UserPage } from './pages/User/UserPage.js';
import { WordPage } from './pages/Word/WordPage.js';
import { LoginPage } from './pages/Auth/LoginPage.jsx';
import { AccountsPage } from './pages/Account/AccountsPage.jsx';
import { DetailMeetingPage } from './pages/Meetting/DetailMeetingPage.jsx';
// import { CreatePage } from './pages/Meetting/Create.jsx';

import { CreateMeetingPage } from './pages/Meetting/CreateMeetingPage.jsx';
import { EditMeetingPage } from './pages/Meetting/EditMeetingPage.jsx';
import { ProfilePage } from './pages/Profile/ProfilePage.jsx';
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route element={<DefaultLayout/>}>
          <Route path='/meeting' element={<WorkspacePage/>} />
          {/* <Route path='/workspace' element={<WorkspacePage/>} /> */}
          <Route path='/user' element={<UserPage/>} />
          <Route path='/word' element={<WordPage/>} />
          <Route path='/meeting/create' element={<CreateMeetingPage/>} />
          <Route path='/meeting/edit/:meetingId' element={<EditMeetingPage/>} />
          <Route path='/accounts' element={<AccountsPage/>} />
          <Route path='/meeting/detail/:meetingId' element={<DetailMeetingPage/>} />
          <Route path='/profile' element={<ProfilePage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
