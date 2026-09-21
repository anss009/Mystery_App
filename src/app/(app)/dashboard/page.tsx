'use client'

import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useCopyToClipboard } from "usehooks-ts"
import z from "zod"

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId : string) => {
    setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId))
  }

  const { data: session } = useSession()
  
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema)
  })
      
  const { register, watch, setValue } = form

  const acceptMessages = watch("acceptMessage")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessage', response.data.isAcceptingMessages   ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])
  
  const fetchMessages = useCallback(async (refresh : boolean = false) => {
    setLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages ?? []) 
      if(refresh){
        toast.success("Messages refreshed successfully")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }, [ setLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user) return 
    fetchMessages()
    fetchAcceptMessage()
  },[session, setValue, fetchAcceptMessage,fetchMessages])
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages : !acceptMessages})
        setValue('acceptMessage', !acceptMessages)
        toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages ")
    }
  }

  const {username} = session?.user as User
  // 
  const baseurl = `${window.location.protocol}// ${window.location.host}`
  const profileUrl = `${baseurl}/u/${username}`
  
  cosnt useCopyToClipboard = ()=>{
    
  }

  if (!session || !session.user) {
    return <div>Please Login</div>
  } 
   return (
    <div className='bg-gray-50'>
      Dashboard
    </div>
  )
}

export default DashboardPage
