// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlogEditor from './components/BlogEditor.jsx';
import Profile from './components/Profile.jsx';
import BlogList from './components/BlogList.jsx';
import EditProfile from './components/EditProfile.jsx';
import BlogDetail from './components/BlogDetail.jsx';
import Background from './components/Background.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './components/Login.jsx';
import LogoutButton from './components/Logout.jsx';
import { ROUTES } from '../constants'; // Import your routes

import './index.css';
import Header from './components/Header.jsx';

const App = () => {
  return (
    <Router>
      <UserProvider>
      <Header />
      </UserProvider>
      <AuthProvider>
        <div className="relative z-0">
          <Routes>
            <Route path={ROUTES.HOME} element={<PrivateRoute><BlogEditor /></PrivateRoute>} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.LOGOUT} element={<LogoutButton />} />
            <Route path={ROUTES.PROFILE(':userId')} element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path={ROUTES.BLOG_LIST} element={<BlogList />} />
            <Route path={ROUTES.EDIT_PROFILE(':userId')} element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path={ROUTES.BLOG_DETAIL(':id')} element={<PrivateRoute><BlogDetail /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
