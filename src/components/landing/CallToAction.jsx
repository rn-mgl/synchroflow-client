import Link from "next/link";
import React from "react";
import team from "@/public//landing/Team.svg";
import Image from "next/image";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white">
      <div
        className="max-w-screen-xl flex flex-col gap-5 justify-center items-center w-full p-5
                t:p-10 l-s:p-20"
      >
        <p
          className="font-black  font-header text-primary-500
                    text-lg m-l:text-xl t:text-4xl l-s:text-5xl l-l:text-6xl"
        >
          Synchronize Your Flow
        </p>
        <p className="text-center leading-relaxed text-sm m-l:text-base t:text-lg l-s:text-xl text-secondary-500">
          Embark on a journey towards ultimate productivity and seamless teamwork. Join SynchroFlow, where tasks sync in
          real-time and collaboration knows no bounds. Let&apos;s revolutionize task management together! Start your
          journey with us today and achieve more, effortlessly.
        </p>

        <Link
          href="/register"
          className="p-2 rounded-md bg-primary-500 border-2 border-primary-500 w-36
                   text-sm font-bold text-white t:text-base text-center"
        >
          Join Now
        </Link>

        <div className="w-full flex flex-col items-center justify-center ">
          <Image
            src={team}
            alt="landing"
            priority
            draggable={false}
            className="w-72 t:w-80 l-l:w-96 animate-float saturate-150"
          />
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
