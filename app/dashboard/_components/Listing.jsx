"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import EmptyState from './EmptyState';
import Link from 'next/link';
import { db } from '@/config/db';
import { AiGeneratedImage } from '@/config/schema';
import { eq } from 'drizzle-orm';
import InteriorDesignCard from './InteriorDesignCard';

function Listing() {
  const { user } = useUser();
  const [userInteriorList, setUserInteriorList] = useState([]);
  useEffect(() => {
    user && GetUserInteriorList();
  }, [user])

  const GetUserInteriorList = async() => {
    const result = await db.select().from(AiGeneratedImage).where(eq(AiGeneratedImage.userEmail,user?.primaryEmailAddress?.emailAddress));
    setUserInteriorList(result);
    
  }
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold text-3xl'>Hello, {user?.fullName}</h2>
        <Link href={'/dashboard/create-new'}>
          <Button>+ Redesign Interior</Button>
        </Link>
      </div>
      {userInteriorList?.length == 0 ? <EmptyState /> : <div className='mt-10'> <h2 className='font-medium text-primary text-xl mb-10'>AI Interior Studio</h2> <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10'> {userInteriorList.map((interior, index) => (<InteriorDesignCard key={index} interior={interior}/>))} </div> </div>}
    </div>
  )
}

export default Listing