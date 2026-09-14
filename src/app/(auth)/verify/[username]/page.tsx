'use client'

import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { toast } from "@/components/ui/toast"
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse'

const verifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data : z.infer<typeof verifySchema>)=>{
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code : data.code
            })

            toast.add({
                title: 'Success',
                description: response.data.message,
                type: 'success',
            })

            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.add({
                title: 'Error',
                description: axiosError.response?.data.message || 'Error verifying code',
                type: 'error',
            })
        }
    }
  return (
    <div >
      
    </div>
  )
}

export default verifyAccount
