"use client"
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'

function Header() {
    const { userDetail } = useContext(UserDetailContext);
    return (
        <div className='p-5 shadow-sm flex flex-wrap items-center gap-4 justify-between md:justify-normal'>
            {/* Logo and Title */}
            <Link href={'/'} className='flex gap-2 items-center flex-shrink-0'>
                <Image src={'/logo.png'} width={40} height={40} alt="Logo" />
                <h2 className='font-bold text-lg'>InteriorDesigner</h2>
            </Link>

            <Link href={'/dashboard/buy-credits'} className='hidden md:flex mx-auto'>
                <Button variant='ghost' className='rounded-full text-md'>
                    Buy More Credits
                </Button>
            </Link>

            <div className='flex gap-4 items-center flex-shrink-0 ml-auto md:ml-0'>
                {userDetail?.credits && (
                    <div className='hidden md:flex gap-2 p-1 items-center bg-slate-200 px-3 rounded-full'>
                        <Image src={'/credit.png'} width={20} height={20} alt="Credits" />
                        <h2>{userDetail?.credits}</h2>
                    </div>
                )}
                <UserButton />
                <Link href={'/dashboard'}>
                    <Button>Dashboard</Button>
                </Link>
            </div>

            <div className='md:hidden w-full flex justify-center items-center gap-4 order-last'>
                <Link href={'/dashboard/buy-credits'}>
                    <Button variant='ghost' className='rounded-full text-md'>
                        Buy More Credits
                    </Button>
                </Link>
                {userDetail?.credits && (
                    <div className='flex gap-2 p-1 items-center bg-slate-200 px-3 rounded-full'>
                        <Image src={'/credit.png'} width={20} height={20} alt="Credits" />
                        <h2>{userDetail?.credits}</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header