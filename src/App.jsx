import React from 'react';
import { Routes, Route } from 'react-router-dom';
import useTitle from './hooks/useTitle';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  useTitle('Bromhead');

  return (
    <>
      <Routes>
        <Route path="/">
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />

          <Route path="home" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
