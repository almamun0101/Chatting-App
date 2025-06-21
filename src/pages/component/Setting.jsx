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
          <h1 className="text-2xl font-bold mb-4">
           Settings
          </h1>
        
        </div>
    </div>
  )
}

export default Setting