'use client'

import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CardHeader, CardTitle, CardContent, Card } from '@/components/ui/card'
import { useCompletion } from '@ai-sdk/react'
import { useParams } from 'next/navigation'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import * as z from 'zod'
import { toast } from 'sonner'
import suggestedMessages from '@/data/suggested-messages.json'

const specialChar = '||'

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).map((msg) => msg.trim()).filter(Boolean)
}

export default function SendMessage() {
  const params = useParams<{ username: string }>()
  const username = params.username

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    streamProtocol: 'text',
    onError: (err) => {
      toast.error(err?.message || 'Failed to fetch suggestions')
    },
  })

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  })

  const messageContent = form.watch('content')

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      })

      toast.success(response.data.message)
      form.reset({ ...form.getValues(), content: '' })
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>
      toast.error(
        axiosError.response?.data.message ?? 'Failed to send message'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      await complete('')
    } catch (err) {
      toast.error('Failed to fetch suggestions')
    }
  }

  const aiMessages = completion ? parseStringMessages(completion) : []

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-sm font-semibold block mb-2">
            Send Anonymous Message to @{username}
          </label>
          <textarea
            placeholder="Write your anonymous message here"
            className="w-full resize-none border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            rows={4}
            {...form.register('content')}
          />
          {form.formState.errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>
        <div className="flex justify-center">
          {isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || !messageContent}>
              Send It
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            type="button"
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Suggest Messages'
            )}
          </Button>
          <p className="text-sm text-gray-600">
            Click on any message below to select it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {aiMessages.length > 0
              ? aiMessages.map((message, index) => (
                  <Button
                    type="button"
                    key={index}
                    variant="outline"
                    className="mb-2 text-left justify-start h-auto py-3 px-4 whitespace-normal"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              : suggestedMessages.map((item, index) => (
                  <Button
                    type="button"
                    key={index}
                    variant="outline"
                    className="mb-2 text-left justify-start h-auto py-3 px-4 whitespace-normal"
                    onClick={() => handleMessageClick(item.message)}
                  >
                    {item.message}
                  </Button>
                ))}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4 text-sm font-semibold">Get Your Message Board</div>
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}