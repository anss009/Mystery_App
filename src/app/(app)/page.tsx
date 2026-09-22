import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-react/react"

import messages from "@/messages.json"

const Home = () => {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen '>
      <h1 className='text-4xl font-bold mb-4 '>Mystery Message</h1>
      <p className='text-lg text-muted-foreground mb-8'>Share anonymous feedback with your friends</p>
    </main>
  )
}

export default Home
