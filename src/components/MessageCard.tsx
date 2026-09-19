'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import axios, { AxiosError } from "axios"
import { toast } from "@/components/ui/toast"
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProps = {
  message: Message
  onMessageDelete: (id: string) => void
}

export const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirmed = async () => {
    try {
      const messageId = message._id as unknown as string
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`)
      toast.add({
        title: "Success",
        description: response.data.message || "Message deleted successfully",
        type: "success"
      })
      onMessageDelete(messageId)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to delete message",
        type: "error"
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" size="icon-sm">
                <X className="w-4 h-4" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirmed}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent />
    </Card>
  )
}

export default MessageCard
