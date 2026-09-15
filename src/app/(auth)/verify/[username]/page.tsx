'use client'

import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { toast } from "@/components/ui/toast"
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Button } from '@/components/ui/button'

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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-800">
            Verify Your Account
          </h1>
          <p className="mb-4 text-sm text-gray-600">
            Enter the verification code sent to your email address.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="code">Verification Code</FieldLabel>   
                <Input
                  placeholder="code"
                  {...field}
                  id="code"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
                )}
          />
          <Button type="submit" className="w-full">
            Verify Account
          </Button>
        </form>
      </div>
    </div>
  )
}

export default verifyAccount
