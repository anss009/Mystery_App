"use client"
import React from 'react'
import Link  from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
const {data: session} = useSession()
const user: User = session?.user

const Navbar = () => {
  return (
    <nav>
        <div>
            <a href="#"> Mystery Message</a>
            
        </div>
    </nav>
  )
}

export default Navbar
