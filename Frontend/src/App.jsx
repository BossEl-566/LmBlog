import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import Header from './components/Header';
import Footer from './components/Footer';
import Signin from './pages/Signin';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import EditPost from './pages/EditPost';

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/signin' element={<Signin/>} />
        <Route element={<PrivateRoute />}>

          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          
          <Route path="/edit-post/:postId" element={<EditPost />} />
          
        </Route>
      </Routes>
      <Footer/>
      <Toaster /> 
      </BrowserRouter>
  )
}
