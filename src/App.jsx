import React from "react";
import { Routes, Route } from "react-router-dom";
import useTitle from "./hooks/useTitle";
import DashLayout from "./components/DashLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import RequireAuth from "./components/auth/RequireAuth";
import { ROLES } from "../config/roles";
import NotFound from "./pages/NotFound";
import PersistLogin from "./components/auth/PersistLogin";
import Projects from "./pages/Projects";
import Prefetch from "./components/auth/Prefetch";
import Clients from "./pages/Clients";

const App = () => {
  useTitle("Bromhead");

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
            >
              <Route element={<Prefetch />}>
                <Route path="dash" element={<DashLayout />}>
                  <Route path="home" element={<Home />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="clients" element={<Clients />} />
                </Route>
              </Route>
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
