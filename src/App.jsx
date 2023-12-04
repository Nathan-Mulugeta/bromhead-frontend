import React from "react";
import { Routes, Route } from "react-router-dom";
import useTitle from "./hooks/useTitle";
import DashLayout from "./components/DashLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";

const App = () => {
  useTitle("Bromhead");

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />

          <Route path="home" element={<DashLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
