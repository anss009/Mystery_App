"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="p-4 md:p-6 shadow-md bg-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-xl font-bold">
          Mystery Message
        </Link>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base font-medium">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button size="sm">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
