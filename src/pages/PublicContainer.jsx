import React, { useEffect } from 'react'
import { useDisptach } from 'react-redux'
import Navbar from './Navbar';
import { Outlet } from 'react-router';
import Footer from './Footer';
function PublicContainer() {

  let dispatch = useDispatch();
  let token = localStorage.getItem("token");


  useEffect(()=>{
    if(token){
      dispatch(getMe()).unwrap()
    }
  },[])

  return (
    <>
    <Navbar></Navbar>
    <Outlet></Outlet>
    <Footer></Footer>
    </>
  )
}

export default PublicContainer