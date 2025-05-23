import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import Page404 from '../pages/Page404'
import BoardPage from '../pages/BoardPage'
import NavBar from '../components/navbar/Navbar'
import Board from '../pages/Board'
// import Login from '../pages/Login'
import Redirigir from '../pages/Redirigir'
import Pizarra from '../pizarra/Pizarra'

const PublicRoute = () => {
  return (

    <BrowserRouter>
      <NavBar />

      <Routes>
        {/* <Route path='/' element={<HomePage />} /> */}
        {/* <Route path='/' element={<Login />} /> */}
        <Route path='/' element={<Redirigir />} />
        <Route path='/pizarra' element={<Pizarra />} />
        <Route path='/board/:id' element={<BoardPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/board' element={<Board />} />
        <Route path='*' element={<Page404 />} />
      </Routes>

    </BrowserRouter>

  )
}

export default PublicRoute