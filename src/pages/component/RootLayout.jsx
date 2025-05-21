
import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router'
import Home from '../Home'

const RootLayout = () => {
  return (
    <div className=''>
        <div className="flex gap-2">
            <div className="border-r-2 border-gray-300 my-2 pr-2">

            <Sidebar/>
            </div>
            <Outlet/>

        </div>
    </div>

  )
}

export default RootLayout