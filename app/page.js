import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "./dashboard/_components/Header";

export default function Home() {
  return (
    <div>
      <Header />


      <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="mt-5 max-w-2xl text-center mx-auto">
            <h1 className="block font-bold text-gray-800 text-3xl md:text-4xl lg:text-5xl dark:text-neutral-200">
              Interior Designer:<br />
              <span className="bg-clip-text bg-gradient-to-tl from-primary to-green-600 text-transparent"> An AI Interior Design Platform</span>
            </h1>
          </div>
          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              Effortless Interior Designing at Your Fingertips! Transform Your Space with AI</p>
          </div>
          <div className="mt-8 gap-3 flex justify-center">
            <a className="inline-flex justify-center items-center 
      gap-x-3 text-center bg-gradient-to-tl from-primary
       to-green-600 hover:from-green-600 hover:to-primary border border-transparent text-white text-xl font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 py-2.5 px-3 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105"
              href="/dashboard">
              Get started
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Image src={'/group.png'} alt="desktopGroup" width={1000} height={600} className='hidden md:block w-full h-auto rounded-lg pl-2 pr-2'/>
        <Image src={'/groupmobile.png'} alt="mobileGroup" width={809} height={1500} className='md:hidden w-full h-auto pl-2 pr-2'/>
      </div>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      </div>
    </div>
  );
}
