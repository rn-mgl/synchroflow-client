import Image from "next/image";
import React from "react";
import landingImage from "../../../public/landing/SynchroFlow.svg";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white">
      <div
        className="max-w-screen-2xl flex flex-col gap-5 justify-center items-center w-full p-5 mt-10
                    t:p-10 l-s:p-20"
      >
        <div className="flex flex-col gap-1 items-center justify-center t:gap-2">
          <p
            className="font-extrabold  font-header bg-gradient-to-r 
                    from-primary-500 to-primary-800 text-transparent bg-clip-text
                    text-lg t:text-4xl l-l:text-5xl"
          >
            Structure.Collaborate.Achieve!
          </p>

          <p className="text-center font-medium leading-relaxed text-sm t:text-lg">
            <span className="font-bold">Empowering Productivity, One Sync at a Time: </span>
            Welcome to SynchroFlow - <br className="hidden l-s:flex" /> Your Real-Time Task Management Hub. Conquer
            Tasks Together!
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 w-full t:flex-row">
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
            src={landingImage}
            alt="landing"
            priority
            draggable={false}
            className="animate-float drop-shadow-lg w-72 t:w-80 l-l:w-96"
          />
        </div>
      </div>
    </div>
  );
}
