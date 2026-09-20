'use client'

import { Message } from "@/model/User"
import { useState } from "react"

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const[isSwitchLoading, setIsSwitchLoading] = useState()
    return (
        <div className='bg-gray-50'>
            Dashboard
        </div>
    )
}

export default page
