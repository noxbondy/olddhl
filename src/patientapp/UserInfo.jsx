import React from 'react'
import "../styles/UserInfo.css"
import AppNavbar from '../components/AppNavbar';
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaBirthdayCake } from "react-icons/fa";
import { FaTransgenderAlt } from "react-icons/fa";
import { BsPhoneVibrate } from "react-icons/bs";
import { FaAddressCard } from "react-icons/fa";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { FaCriticalRole } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
 const Userinfo = ({ user }) => {
 if (!user) return <p>No user info available.</p>;

  return (
    <div className='app-container'>
       <AppNavbar/>
<div className='userinfo-container'>
     
<h2>  <CgProfile />  Welcome, {user.firstName}!</h2>
<br/>
     <div className='user-info'>
 <p><MdOutlineConfirmationNumber /><strong className='user-label'>Personal Number:</strong> {user.personalNumber}</p>
      </div>
      <div className='user-info'>
<p><MdDriveFileRenameOutline /><strong className='user-label'>Full Name:</strong> {user.firstName} {user.lastName}</p>
      </div>
      <div className='user-info'>
 <p><FaBirthdayCake /><strong className='user-label'>Date of Birth:</strong> {user.dateOfBirth}</p>
      </div>
       <div className='user-info'>
 <p><FaTransgenderAlt /><strong className='user-label'>Gender:</strong> {user.gender}</p>
      </div>
      <div className='user-info'>
<p><BsPhoneVibrate /><strong className='user-label'>Phone Number:</strong> {user.phoneNumber}</p>
      </div>
       <div className='user-info'>
 <p><FaAddressCard /><strong className='user-label'>Address:</strong> {user.address}</p>
      </div>
       <div className='user-info'>
 <p><MdOutlineMarkEmailUnread /><strong className='user-label'>Email:</strong> {user.email}</p>
      </div>
       <div className='user-info'>
 <p><FaCriticalRole /><strong className='user-label'>Role:</strong> {user.role}</p>
      </div>
    </div>
    </div>
    
  )
}
export default Userinfo;
