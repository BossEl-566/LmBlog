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
import Trending from './pages/Trending';
import News from './pages/News';
import Entertainment from './pages/Entertainment';
import Sports from './pages/Sports';
import Technology from './pages/Technology';
import Lifestyle from './pages/Lifestyle';
import Travel from './pages/Travel';
import Health from './pages/Health';
import Business from './pages/Business';
import Food from './pages/Food';
import Science from './pages/Science';

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
        <Route path='/trending' element={<Trending/>} />
        <Route path="/news" element={<News/>} />
        <Route path="/sports" element={<Sports/>} />
        <Route path="/entertainment" element={<Entertainment/>} />
        <Route path="/category/technology" element={<Technology/>} />
        <Route path="/category/lifestyle" element={<Lifestyle/>} />
        <Route path="/category/travel" element={<Travel/>} />
        <Route path='/category/health' element={<Health/>} />
        <Route path="/category/business" element={<Business/>} />
        <Route path="/category/food" element={<Food/>} />
        <Route path="/category/science" element={<Science/>} />
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
