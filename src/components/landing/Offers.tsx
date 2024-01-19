import React from "react";
import task from "@/public//landing/Task.png";
import task2 from "@/public//landing/Task2.png";
import singleTask from "@/public//landing/SingleTask.png";
import messages from "@/public//landing/Messages.png";
import associates from "@/public//landing/Associates.png";
import invites from "@/public//landing/Invites.png";
import notif from "@/public//landing/Notif.png";
import Image from "next/image";

const Offers = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-primary-500">
      <div
        className="max-w-screen-2xl flex flex-col gap-4 items-center w-full p-4 justify-center
                    t:p-10 l-s:p-20"
      >
        <div className="flex flex-col items-center justify-center gap-2 t:gap-8 w-full">
          <p
            className="font-black font-header text-white
                    text-lg m-l:text-xl t:text-4xl l-s:text-5xl l-l:text-6xl"
          >
            Real-Time Social Task Hub
          </p>

          <div className="w-full flex flex-col gap-2 items-center justify-start">
            <p className="font-bold text-white text-left w-full t:text-2xl l-s:text-3xl">
              Create, Collaborate, and Assign
            </p>
            <p
              className="font-normal text-primary-100 text-left w-full text-sm t:text-base 
                        max-w-lg mr-auto l-s:text-lg"
            >
              Boost productivity and streamline teamwork as you effortlessly manage your projects. Experience the
              seamless power of real-time efficient task coordination at your fingertips.
            </p>
            <div
              className="w-full rounded-lg bg-gradient-to-br from-primary-200 
                  via-primary-100 to-primary-200 p-4 border-2 border-white
                  flex flex-col gap-4 t:p-10 t:gap-8"
            >
              <Image src={task} alt="task" className="w-full rounded-md hover:scale-105 transition-all" />

              <Image src={task2} alt="task2" className="w-full rounded-md hover:scale-105 transition-all" />

              <Image src={singleTask} alt="singleTask" className="w-full rounded-md hover:scale-105 transition-all" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 items-center justify-start">
            <p className="font-bold text-white text-right w-full t:text-2xl l-s:text-3xl">Connect</p>
            <p
              className="font-normal text-primary-100 text-right w-full text-sm t:text-base 
                        max-w-lg ml-auto l-s:text-lg"
            >
              Expand your network by adding friends and stay in the loop with their updates. Enhance professional
              relationships and foster collaboration. Start connecting today and build a stronger community within your
              workspace.
            </p>
            <div
              className="w-full rounded-lg bg-gradient-to-br from-primary-200 
                  via-primary-100 to-primary-200 p-4 border-2 border-white
                  flex flex-col gap-4 t:p-10 t:gap-8"
            >
              <Image src={associates} alt="associates" className="w-full rounded-md hover:scale-105 transition-all" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 items-center justify-start">
            <p className="font-bold text-white text-left w-full t:text-2xl l-s:text-3xl">Communicate</p>
            <p
              className="font-normal text-primary-100 text-left w-full text-sm t:text-base 
                        max-w-lg mr-auto l-s:text-lg"
            >
              Unleash seamless communication with our Messaging and File Sharing function! Share images, audio, video,
              and PDFs in private or group chats. Elevate collaboration effortlessly.
            </p>
            <div
              className="w-full rounded-lg bg-gradient-to-br from-primary-200 
                  via-primary-100 to-primary-200 p-4 border-2 border-white
                  flex flex-col gap-4 t:p-10 t:gap-8"
            >
              <Image src={messages} alt="messages" className="w-full rounded-md hover:scale-105 transition-all" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 items-center justify-start">
            <p className="font-bold text-white text-right w-full t:text-2xl l-s:text-3xl">Invite Associates</p>
            <p
              className="font-normal text-primary-100 text-right w-full text-sm t:text-base 
                        max-w-lg ml-auto l-s:text-lg"
            >
              Simplify networking with our Invite Sending feature! Easily extend invitations to colleagues and
              collaborators. Streamline connections and amplify your professional network.
            </p>
            <div
              className="w-full rounded-lg bg-gradient-to-br from-primary-200 
                  via-primary-100 to-primary-200 p-4 border-2 border-white
                  flex flex-col gap-4 t:p-10 t:gap-8"
            >
              <Image src={invites} alt="invites" className="w-full rounded-md hover:scale-105 transition-all" />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 items-center justify-start">
            <p className="font-bold text-white text-left w-full t:text-2xl l-s:text-3xl">Stay Informed</p>
            <p
              className="font-normal text-primary-100 text-left w-full text-sm t:text-base 
                        max-w-lg mr-auto l-s:text-lg"
            >
              Receive real-time updates on task assignments, messages, file shares, and new connections. Keep your
              finger on the pulse of your collaborative space.
            </p>
            <div
              className="w-full rounded-lg bg-gradient-to-br from-primary-200 
                  via-primary-100 to-primary-200 p-4 border-2 border-white
                  flex flex-col gap-4 t:p-10 t:gap-8"
            >
              <Image src={notif} alt="notif" className="w-full rounded-md hover:scale-105 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
