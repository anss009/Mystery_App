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
            {
                session ? (
                    <span> Welcome, {user.username || user.email}</span>
                    <button>Logout</button>
                ) : ()
            }
        </div>
    </nav>
  )
}

export default Navbar
