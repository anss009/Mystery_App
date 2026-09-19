'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from "@react-email/components"
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import axios from "axios"

type MessageCardProps = {
  message: Message
  onMessageDelete: (id:string) => void
}

export const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
  
    const {toast} = useToast()
    const response =await  axios.delete(`/api/messages/${message._id}`)
    handleDeleteConfirmed = async()=>{
        if(response.status === 200){
            toast.add({
                title: "Message deleted successfully",
                description: "The message has been deleted successfully",
                type: "success"
            })
        }
    }

  const handleDeleteConfirmed = () => {
    onMessageDelete(message.id)
  } 

  return (
    <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirmed} >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
  </CardContent>
</Card>
  )
}
