import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import UpdatePassword from './pages/UpdatePassword/UpdatePassword';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import OfficerDashboard from './pages/OfficerDashboard/OfficerDashboard';
import CitizenDashboard from './pages/CitizenDashboard/CitizenDashboard';
import CouncillorDashboard from './pages/CouncillorDashboard/CouncillorDashboard';

function App() {

  return (
    <>
   <Routes>
    <Route path='/' element={<LandingPage />}></Route>
    <Route path='/login' element={<Login />}></Route>
    <Route path='/signup' element={<Signup />}></Route>
    <Route path='/change-password' element={<UpdatePassword />}></Route>
    <Route path='/admin/dashboard' element={<AdminDashboard />}></Route>
    <Route path='/officer/dashboard' element={<OfficerDashboard />}></Route>
    <Route path='/citizen/dashboard' element={<CitizenDashboard />}></Route>
    <Route path='/councillor/dashboard' element={<CouncillorDashboard />}></Route>
   </Routes>

   <ToastContainer
   position="top-right"
   autoClose={1000}
   newestOnTop
   theme="light"
   transition={Slide}
/>
   </>
  )
}

export default App
