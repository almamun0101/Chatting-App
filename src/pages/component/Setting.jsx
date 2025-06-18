import React from 'react'
import { Navigate, useNavigate } from 'react-router'

const Setting = () => {
  const navigate = useNavigate();

  const handleLogOut = ()=>{
    navigate('/signup')
    
  }

  return (
    <div>
      <div className="">
       
      </div>
    </div>
  )
}

export default Setting