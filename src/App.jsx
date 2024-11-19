import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/home';
import PostPage from './pages/post';
import SinglePostPage from './pages/singlePost';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/post/:id" element={<SinglePostPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;