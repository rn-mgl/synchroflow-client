import Image from "next/image";
import React from "react";
import collaborate from "@/public//landing/Collaborate.svg";

import Link from "next/link";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white">
      <div
        className="max-w-screen-2xl flex flex-col gap-4 justify-center items-center w-full p-4
                    t:p-10 l-s:p-20"
      >
        <div className="flex flex-col gap-1 items-center justify-center t:gap-2 l-s:gap-4 w-full">
          <p
            className="font-black  font-header bg-gradient-to-r 
                    from-primary-500 to-primary-800 text-transparent bg-clip-text
                    text-lg m-l:text-xl t:text-4xl l-s:text-5xl l-l:text-6xl"
          >
            Structure.Collaborate.Achieve!
          </p>

          <p className="text-center leading-relaxed text-sm m-l:text-base  t:text-lg l-s:text-xl text-secondary-500">
            <span className="font-bold">Empowering Productivity, One Sync at a Time: </span>
            Welcome to SynchroFlow - <br className="hidden l-s:flex" /> Your Real-Time Task Management Hub. Conquer
            Tasks Together!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 w-full t:flex-row t:gap-4">
          <Link
            href="/register"
            className="p-2 rounded-md bg-primary-500 border-2 border-primary-500 t:w-36
                    w-full text-sm font-bold text-white t:text-base text-center"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="p-2 rounded-md border-2 border-primary-500 t:w-36 text-center
                    w-full text-sm font-bold text-primary-500 t:text-base"
          >
            Login
          </Link>
        </div>

        <div className="w-full flex flex-col items-center justify-center ">
          <Image
            src={collaborate}
            alt="landing"
            priority
            draggable={false}
            className="animate-float drop-shadow-md w-72 t:w-80 l-l:w-96 saturate-150"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
