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
import AddClient from "./pages/AddClient";
import ClientDetails from "./pages/clientDetails";
import Users from "./pages/Users";
import MyProfile from "./pages/MyProfile";
import EmployeeDetils from "./pages/EmployeeDetils";
import AddEmployee from "./pages/AddEmployee";

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

                  <Route path="profile">
                    <Route index element={<Profile />} />
                    <Route path=":userId" element={<MyProfile />} />
                  </Route>

                  <Route path="projects" element={<Projects />} />
                  <Route path="employees">
                    <Route index element={<Users />} />
                    <Route path=":userId" element={<EmployeeDetils />} />
                    <Route path="add" element={<AddEmployee />} />
                  </Route>

                  <Route path="clients">
                    <Route index element={<Clients />} />
                    <Route path="add" element={<AddClient />} />
                    <Route path=":clientId" element={<ClientDetails />} />
                  </Route>
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
