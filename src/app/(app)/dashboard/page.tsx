'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: false,
    },
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch("acceptMessage")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessage', response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages ?? [])
      if (refresh) {
        toast.success("Messages refreshed successfully")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }, [setLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: !acceptMessages })
      setValue('acceptMessage', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages ")
    }
  }

  const { username } = session?.user as User
  // 
  const baseurl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseurl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard")
  }

  if (!session || !session.user) {
    return <div>Please Login</div>
  }
  return (
    <>
    <div className="my-8 mx-auto p-6 max-w-6xl bg-white rounded w-full max-w-4xl shadow-xl space-y-6">
      <h1 className="text-4xl font-bold mb-4 ">User Dashboard</h1>
      <div className="p-4 md:p-8 w-full">
        <h2 className="text-2xl font-bold mb-4 ">Copy Your unique link</h2>{' '}
        <div className="flex items-centre">
          <input type="text" value={profileUrl} disabled className="bg-gray-50 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 w-80" />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
    </div>

    <div className="mb-4 ">
      <Switch
        {...register('acceptMessage')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
      />
      <div>
        <label htmlFor="acceptMessages" className="text-sm font-semibold mr-2">Accept Messages:</label>
        <span className="text-sm font-semibold mr-2">{acceptMessages ? 'On' : 'Off'}</span>
      </div>
      <Separator/>

      <Button className="mt-4" variant="outline" onClick={(e) => fetchMessages(true)}>
        {loading ? <Loader2/> : "Refresh Messages"}
      </Button>

      <div className="space-y-4 mt-4">
        {messages.length>0?(
          messages.map((messages, index) => (
            <MessageCard
              key={index}
              message={messages}
              onMessageDelete={handleDeleteMessage}
              />
          ))
        ): (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  </>
  )
}

export default DashboardPage
