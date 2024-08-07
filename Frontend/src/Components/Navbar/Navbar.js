import React from 'react'
import './Navbar.css'
import logo from './logo.png'
import { IoIosLogOut } from "react-icons/io";
import { logedout } from '../../Helper/LoginSlice';
import { useDispatch } from 'react-redux';


function Navbar() {
    const dispatch = useDispatch();
    function handleLogout(){
        dispatch(logedout())
    }
  return (
    <div className='NavouterDiv'>
      <p className='nav-title'>Ponmurugan Dhall Mill</p>
      <div className='logoutDiv' onClick={handleLogout}><IoIosLogOut className='logout'/></div>
      
    </div>
  )
}

export default Navbar
