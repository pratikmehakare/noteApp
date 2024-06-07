import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Home from './pages/Home/Home'

const App = () => {
  return (
    <Routes>
      <Route path='/dashboard' element={<Home/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>

    </Routes>
  )
}

export default App
