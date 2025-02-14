import './App.css';
import Home from './components/Home';
import Jobs from './components/Jobs';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PostJob from './components/PostJob';
import SaveJobs from './components/SaveJobs';
import Discussion from './components/Discussion';
import ErrorPage from './components/ErrorPage';
import ApplyJobs from './components/ApplyJobs';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/apply-jobs/:jobId" element={<ApplyJobs />} />
          <Route path="/saved-job" element={<SaveJobs />} />
          <Route path="/discussion" element={<Discussion />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
