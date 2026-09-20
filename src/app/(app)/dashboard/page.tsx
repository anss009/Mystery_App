'use client'

import { Message } from "@/model/User"
import { useState } from "react"
import { toast } from "sonner"

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  
  return (
    <div className='bg-gray-50'>
      Dashboard
    </div>
  )
}

export default DashboardPage
