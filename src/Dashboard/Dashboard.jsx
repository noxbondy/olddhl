import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ParentContext } from "../context/ParentContext";
import Navbar from '../components/Navbar';
import "../styles/Deshboard.css"
import { MdNoMeals } from "react-icons/md";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MdAddTask } from "react-icons/md";
import { PiUserList } from "react-icons/pi";

 const Dashboard = () => {
    const [message, setMessage] = useState("Hello from Parent");

  const handleChildMessage = (msg) => {
    alert("Message from child: " + msg);
  };

  return (
    <ParentContext.Provider
      value={{ parentMessage: message, sendToParent: handleChildMessage }}
    >
<div>
  <Navbar/>
<div className='container'>
        
        <div className='col-sm-12 justify-content-center mx-auto'>
            <div className='layout-container'>
<aside className='sidebar'>
    <ul>
    <li>
      <Link to="meal" className="menu-item">
        <MdNoMeals /> Meal
      </Link>
    </li>
    <br/>
    
    <li>
      <Link to="reminder" className="menu-item">
        <FaClockRotateLeft /> Reminder
      </Link>
    </li>
    <br/>
    <li>
      <Link to="TaskAssign" className="menu-item">
        <MdAddTask /> Task Assignment
      </Link>
    </li>
    <br/>
    
    <li>
      <Link to="UsersList" className="menu-item">
        <PiUserList /> Users List
      </Link>
    </li>
    <br/>
    
  </ul>
     

          
</aside>
<main className="main-content">
          <Outlet />
        </main>
            </div>

        </div>
       </div>
</div>
    
       </ParentContext.Provider>
  )
}
export default Dashboard;
