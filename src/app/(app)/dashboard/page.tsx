'use client'

import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { setServers } from "dns"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId : string) => {
    setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId))
  }

    const {data: session} =useSession()
    
    const form = useForm<z.infer<typeof acceptMessageSchema>>({
      resolver: zodResolver(acceptMessageSchema)
    })
        
    const {register, watch, setValue} = form

    const acceptMessages =  watch("acceptMessage")

    const fetchAcceptMessage = useCallback( async ()= >{
      setIsSwitchLoading(true)
      try {
     const response =    await axios.get<ApiResponse>('/api/accept-messages')
     setValue('acceptMessages', response.data.isAcceptingMessages)
      } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>        
      }
    }, [setValue], session)
 
  return (
    <div className='bg-gray-50'>
      Dashboard
    </div>
  )
}

export default DashboardPage
