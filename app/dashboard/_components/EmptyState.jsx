import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function EmptyState() {
  return (
    <div className='flex items-center justify-center mt-10 flex-col'>
      <Image src={'/logo2.png'} width={200} height={200} alt='logo2'/>
      <h2 className='font-medium text-lg text-gray-500'>Create a New AI Interior Design</h2>
      <Link href={'/dashboard/create-new'}>
        <Button className='mt-5'>+ Start Interior Redesign</Button>
      </Link>
    </div>
  )
}

export default EmptyState