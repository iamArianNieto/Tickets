import React from 'react'
import Footer from '../components/Footer/footer.js'
import Login from './login'
export default function Inicio() {
  return (
    <>
    <Login></Login>
    <Footer esLoggin={'Si'}></Footer>
   </>
  )
}