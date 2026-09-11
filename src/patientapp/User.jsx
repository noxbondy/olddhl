
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../components/Navbar';

import MealInfo from "../patientapp/MealInfo";
import ReminderInfo from "../patientapp/ReminderInfo";
import "../styles/User.css"
import AppNavbar from "../components/AppNavbar";


const User = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <p>❌ No user logged in</p>;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container">
      <AppNavbar/>
      
      <div className="col-sm-12">      
      
     
    
<div className="meal-bg">
{/* Only show for patients */}
      {user.role === "PATIENT" && (
        <>
          <MealInfo personalNumber={user.personalNumber} />
          <ReminderInfo personalNumber={user.personalNumber} />
        </>
      )}
      
</div>
      

     
       </div>
    </div>
  );
};

export default User;
