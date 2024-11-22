// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogEditor from './components/BlogEditor.jsx';
import Profile from './components/Profile.jsx';
import BlogList from './components/BlogList.jsx';
import EditProfile from './components/EditProfile.jsx';
import BlogDetail from './components/BlogDetail.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './components/Login.jsx';
import LogoutButton from './components/Logout.jsx';
import { ROUTES } from '../constants'; // Import your routes
import EditArticle from './components/EditArticle.jsx';
import Explore from './components/Explore.jsx';
import './index.css';
import Header from './components/Header.jsx';
import SearchResults from './components/SearchResults.jsx';
import SeeProfile from './components/SeeProfile.jsx'
import Shorts from './components/Shorts.jsx';
import UploadVideo from './components/UploadVideo.jsx';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <div className="relative z-0">
          <Routes>
            <Route path={ROUTES.HOME} element={<PrivateRoute><BlogEditor /></PrivateRoute>} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.LOGOUT} element={<LogoutButton />} />
            <Route path="/edit-blog/:id" element={<EditArticle />} />
            <Route path={ROUTES.PROFILE(':userId')} element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/shorts" element={<PrivateRoute><Shorts /></PrivateRoute>} />
            <Route path="/upload-video" element={<PrivateRoute><UploadVideo /></PrivateRoute>} />
            <Route path={ROUTES.SEEPROFILE(':userId')} element={<PrivateRoute><SeeProfile /></PrivateRoute>} />
            <Route path="/explore" element={<Explore />} />
            <Route path={ROUTES.BLOG_LIST} element={<BlogList />} />
            <Route path={ROUTES.EDIT_PROFILE(':userId')} element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path={ROUTES.BLOG_DETAIL(':id')} element={<PrivateRoute><BlogDetail /></PrivateRoute>} />
            <Route path="/search-results" element={<SearchResults />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
