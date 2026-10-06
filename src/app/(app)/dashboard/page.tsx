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
import { Loader2, Copy, RefreshCw } from "lucide-react"
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
  const [baseUrl, setBaseUrl] = useState('')

  const { data: session, status } = useSession()

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: false,
    },
  })

  const { setValue, watch } = form
  const acceptMessages = watch("acceptMessage")

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => (message._id as unknown as string) !== messageId))
  }

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
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const nextStatus = !acceptMessages
      const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: nextStatus })
      setValue('acceptMessage', nextStatus)
      toast.success(response.data.message || "Message settings updated")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to update message settings")
    }
  }

  const username = (session?.user as User)?.username
  const profileUrl = baseUrl && username ? `${baseUrl}/u/${username}` : ''

  const copyToClipboard = () => {
    if (!profileUrl) return
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard")
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg font-medium text-gray-600">
        Please Login to view your dashboard
      </div>
    )
  }

  return (
    <div className="my-8 mx-auto p-6 bg-white rounded-xl max-w-4xl shadow-md space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">User Dashboard</h1>

      {/* Unique Link Section */}
      <div className="p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Copy Your Unique Link</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none w-full sm:max-w-md"
          />
          <Button onClick={copyToClipboard} className="flex items-center gap-1.5">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>

      {/* Switch Accept Messages */}
      <div className="flex items-center space-x-3 py-2">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-sm font-medium">
          Accept Messages: <span className="font-semibold">{acceptMessages ? 'On' : 'Off'}</span>
        </span>
      </div>

      <Separator />

      {/* Refresh Messages Button */}
      <Button
        variant="outline"
        onClick={() => fetchMessages(true)}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? "Refreshing..." : "Refresh Messages"}
      </Button>

      {/* Messages Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as unknown as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full py-8 text-center">No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
