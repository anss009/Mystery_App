import { useToastManager } from '@/components/ui/toast'
import { signUpValidation } from '@/schemas/signUpSchema'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const verifyAccount = () => {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const {toast} = useToast()
     const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
       
      })
      
  return (
    <div>
      
    </div>
  )
}

export default verifyAccount
