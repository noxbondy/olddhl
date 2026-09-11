import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./patientapp/User"; 
import Assistant from "./patientapp/Assistant ";
import UsersList from "./pages/UsersList";

import UserInfo from "./patientapp/UserInfo";
import Dashboard from "./Dashboard/Dashboard"; 
import Meal from "./pages/Meal"; 
import Reminder from "./pages/Reminder"; 
import TaskAssign from "./pages/TaskAssign";   // ✅ Import TaskAssign
import AssigneedBy from "./patientapp/AssigneedBy";   // ✅ Import AssigneedBy
import CreateTask from "./pages/CreateTask";   // ✅ Import CreateTask
import AdminPanel from "./pages/AdminPanel"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import PWAInstallPrompt from "./PWAInstallPrompt";
import ResetPassword from "./pages/ResetPassword"; // ✅ Import ResetPassword
const App = () => {
  const user = JSON.parse(localStorage.getItem("user")); 
  const isLoggedIn = !!user;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/reset-password" element={<ResetPassword />} />
        {/* User page (patients or family) */}

        <Route
          path="/user"
          element={isLoggedIn ? <User /> : <Navigate to="/" replace />}
        />
        <Route
          path="/userinfo"
          element={isLoggedIn ? <UserInfo user={user} /> : <Navigate to="/" replace />}
        />
         <Route
          path="/Assistant"
          element={isLoggedIn ? <Assistant user={user} /> : <Navigate to="/" replace />}
        />

        {/* Admin Panel: only ADMIN & MANAGEMENT */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} allowedRoles={["ADMIN", "MANAGEMENT"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />


<Route
  path="/assigneedby"
  element={
    isLoggedIn && user.role !== "PATIENT" ? (
      <AssigneedBy user={user} />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>

        {/* Dashboard routes for non-patient roles */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "ADMIN",
                "MANAGEMENT",
                "DOCTOR",
                "DIETITIAN",
                "NURSE",
                "NURSE_ASSISTANT",
              ]}
            >
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        >
          {/* 👇 Sub-pages under dashboard */}
          <Route index element={<p>Welcome to Dashboard</p>} />
          <Route path="meal" element={<Meal />} />
          <Route path="reminder" element={<Reminder />} />
          <Route path="taskassign" element={<TaskAssign />} /> {/* ✅ Added */}
          <Route path="createtask" element={<CreateTask />} /> {/* ✅ Added */}
          <Route path="UsersList" element={<UsersList />} /> {/* ✅ Added */}
          
         
        </Route>

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              user.role === "PATIENT" || user.role === "FAMILY" || user.role === "NURSE" ? (
                <Navigate to="/user" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      
    </Router>
  );
};

export default App;