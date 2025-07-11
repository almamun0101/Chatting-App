import React from 'react'

const date = () => {
    const now = new Date();
    const year  =  now.getFullYear()
    const month  =  now.getMonth()
    const date  =  now.getDate()
    const hours  =  now.getHours()
    const minutes  =  now.getMinutes()

    const time = `${year}-${month+1}-${date}-${hours}-${minutes}`
   

  return time
}

export default date