"use client"
import React from 'react'
import Link  from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from '@react-email/components'
const {data: session} = useSession()
const user: User = session?.user

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-4'>
            <Link href="/" className='text-2xl font-bold'> Mystery Message</Link>
            {
                session ? ( 
                    <>
                    <span className='text-2xl font-bold'> Welcome, {user.username || user.email}</span>
                    <Button className='w-full' onClick={()=>{
                        signOut()
                    }}>Logout</Button>
                    </>
                ) : (
                    <Link href='/sign-in'>
                        <Button className='w-full'>Login</Button>
                    </Link>
                 )
            }
        </div>
    </nav>
  )
}

export default Navbar
