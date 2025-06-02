import React from 'react'
import { useSelector } from 'react-redux';

const Setting = () => {
   const data = useSelector((state)=>(state));
  console.log(data);
  return (
    <div>Setting</div>
  )
}

export default Setting