import React from "react";

export default function Offers() {
  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-primary-500">
      <div
        className="max-w-screen-2xl flex flex-col gap-5 items-center w-full p-5 justify-center
                    t:p-10 l-s:p-20"
      >
        <div className="flex flex-col items-center justify-center gap-2 l-s:gap-5 w-full">
          <p
            className="font-black  font-header text-white
                    text-lg m-l:text-xl t:text-4xl l-s:text-5xl l-l:text-6xl"
          >
            Real-Time Social Task Hub
          </p>
        </div>
      </div>
    </div>
  );
}
