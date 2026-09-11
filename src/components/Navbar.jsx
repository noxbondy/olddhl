import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import "../styles/Navbar.css"

 const Navbar = () => {
const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // { email, role }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <nav>
        
        
        <Link to="/">Login</Link>
        <Link to="/Register">Sign Up</Link>
        <Link to="/Dashboard">Dashboard</Link>
      </nav>
    );
  }

  return (
  <nav  className="navbar">
    
  <div className="navbar-brand">
{/* 👇 Role based links */}
        {user.role === "ADMIN" && (
          < >
          <div className="nav-da">
            <MdDashboard /> <Link to="/dashboard">DASHBOARD</Link>
           <RiAdminFill /> <Link to="/admin">ADMIN PANEL</Link>
          </div>
          
            
          </>
          
          
        )}
        

        

        {user.role === "MANAGEMENT" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/reports">Reports</Link>
          </>
        )}

        {user.role === "DOCTOR" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/patients">Patients</Link>
          </>
        )}

        {user.role === "DIETITIAN" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/nutrition">Nutrition</Link>
          </>
        )}

        {(user.role === "NURSE" || user.role === "NURSE_ASSISTANT") && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            
          </>
        )}

        {user.role === "FAMILY" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/family">Family Section</Link>
          </>
        )}

        {user.role === "PATIENT" && (
          <>
            <Link to="/User">Patient Page</Link>
          </>
        )}
  </div>
  <div className="navbar-logo">
       <img src="/logo.png" alt="Logo" width="100" />
     </div>
 <div className="logout-button">
<button className="button" onClick={handleLogout}>Logout</button>
</div>
</nav>

  

    
  )
}
export default Navbar
