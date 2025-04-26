
import LoginForm from '@/components/auth/LoginForm'
import React from 'react'
import "../globals.css"
import PublicRoute from '@/components/common/PublicRoute'

const page = () => {
  return (
    <div  className='bg-purple-700'>
      <PublicRoute>

      <LoginForm/>
      </PublicRoute>
   
    </div>
  )
}

export default page
