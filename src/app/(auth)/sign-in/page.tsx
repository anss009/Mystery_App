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
import { Form } from "lucide-react"
import { Field } from "@/components/ui/field"


const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

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
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
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


  const onSubmit = async(data: z.infer<typeof signupSchema>)=>{
    setIsSubmitting(true);
    try{
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    }catch (error) {
      console.log("Error signing up:", error); 
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = "An error occurred during sign-up";
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "An error occurred during sign-up",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-2 bg-white rounded shadow-md"> 
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-800">
          Join Mystery Message
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Signup to start your anoymous adventures.
          </p>
          </div> 
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
 
              </form>
          </Form>
        </div>
    </div>
  ) 
}

export default page
function useToast(): { toast: any } {
  throw new Error("Function not implemented.")
}

