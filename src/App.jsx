import React from "react";
import { Routes, Route } from "react-router-dom";
import useTitle from "./hooks/useTitle";
import DashLayout from "./components/DashLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import RequireAuth from "./components/auth/RequireAuth";
import { ROLES } from "../config/roles";
import NotFound from "./pages/NotFound";

const App = () => {
  useTitle("Bromhead");

  return (
    <>
      <ToastContainer transition={Flip} />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />

          {/* Protected routes */}
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Wildcard route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
