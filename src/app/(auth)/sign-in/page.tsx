'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import link from "next/link"
import React, { useState, useEffect } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

const page = () => {
  const [username, setUsername] = useState(' ');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const[isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300);
  const {toast} = useToast();
  const router = useRouter()


  // Zod implementation for form validation

  const form = useForm({
    resolver: zodResolver(
      z.object({signupSchema: z.object({
        username: z.string().min(3, { message: "Username must be at least 3 characters long" })
      })})
    ),
    defaultValues: {
      signupSchema: {
        username: "",
      },
    },
  }) 

  useEffect(()=>{

    const checkUsernameUniqueness = async () => {
      if(debouncedUsername){
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try{
          await  
        } catch (error) {

        }
      }
    }

  }, [debouncedUsername])

  return (
    <div>
      
    </div>
  )
}

export default page
function useToast(): { toast: any } {
  throw new Error("Function not implemented.")
}

