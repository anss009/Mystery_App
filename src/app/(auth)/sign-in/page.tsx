'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import link from "next/link"
import React, { useState, useEffect } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { set } from "node_modules/zod/v3/external.cjs"

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
        const response =   await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);

        setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "An error occurred while checking username" 
          )
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUniqueness(); 
  }, [debouncedUsername])


  const on

  return (
    <div>
      
    </div>
  )
}

export default page
function useToast(): { toast: any } {
  throw new Error("Function not implemented.")
}

