import Link from "next/link";
import React from "react";
import {
  AiFillCaretRight,
  AiOutlineClockCircle,
  AiOutlinePlus,
  AiOutlineRightSquare,
  AiOutlineUser,
} from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

const SingleTask = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
            items-center w-full h-full"
      >
        <div className="flex flex-col p-4 items-center justify-start w-full h-auto t:p-10  gap-4">
          <Link href="/hub/tasks" className="mr-auto hover:bg-secondary-500 hover:bg-opacity-10 p-2 rounded-full">
            <BsArrowLeft className="text-lg" />
          </Link>

          <div className="grid grid-cols-1 items-center justify-start w-full h-full gap-10 l-s:grid-cols-3">
            <div className="flex flex-col items-center justify-start w-full h-full gap-10 col-span-1 l-s:col-span-2">
              <div className="w-full rounded-2xl h-40 bg-primary-500" />

              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <p className="text-2xl font-medium text-secondary-500">Title</p>

                <div className="flex flex-row gap-2 text-secondary-400 text-sm">
                  <p>Sub Title</p> |{" "}
                  <button
                    className="text-primary-500 flex flex-row items-center 
                          justify-center gap-1 hover:underline underline-offset-2"
                  >
                    <div>
                      <AiOutlinePlus className="text-xs" />
                    </div>{" "}
                    Invite
                  </button>
                </div>

                <div className="flex flex-row gap-4 text-sm">
                  <div className="flex flex-row items-center justify-center gap-1">
                    <div>
                      <AiOutlineUser className="text-lg text-secondary-400" />
                    </div>{" "}
                    5 Associates
                  </div>
                  <div className="flex flex-row items-center justify-center gap-1">
                    <div>
                      <AiOutlineClockCircle className="text-lg text-secondary-400" />
                    </div>{" "}
                    Dec. 21, 2023
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
                <p className="text-2xl font-medium ">Description</p>

                <p className="leading-relaxed">
                  Follow the video tutorial above. Understand how to use each tool in the Figma application. Also learn
                  how to make a good and correct design. Starting from spacing, typography, content, and many other
                  design hierarchies. Then try to make it yourself with your imagination and inspiration.
                </p>
              </div>

              <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
                <p className="text-2xl font-medium ">Description</p>

                <p className="leading-relaxed">
                  Follow the video tutorial above. Understand how to use each tool in the Figma application. Also learn
                  how to make a good and correct design. Starting from spacing, typography, content, and many other
                  design hierarchies. Then try to make it yourself with your imagination and inspiration.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start w-full h-full gap-10 col-span-1 ">
              <p className="mr-auto">Specifics</p>

              <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
                <p className="text-2xl font-medium ">Details</p>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div>
                      <AiFillCaretRight />
                    </div>

                    <p>Follow the video tutorial above.</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div>
                      <AiFillCaretRight />
                    </div>

                    <p>Follow the video tutorial above.</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div>
                      <AiFillCaretRight />
                    </div>

                    <p>Follow the video tutorial above.</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div>
                      <AiFillCaretRight />
                    </div>

                    <p>Follow the video tutorial above.</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div>
                      <AiFillCaretRight />
                    </div>

                    <p>Follow the video tutorial above.</p>
                  </div>{" "}
                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div>
                      <AiFillCaretRight />
                    </div>

                    <p>Follow the video tutorial above.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
                <p className="text-2xl font-medium ">Associates</p>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div className="w-8 h-8 bg-primary-200 rounded-full" /> <p>Associated User</p>
                  </div>

                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div className="w-8 h-8 bg-primary-200 rounded-full" /> <p>Associated User</p>
                  </div>

                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div className="w-8 h-8 bg-primary-200 rounded-full" /> <p>Associated User</p>
                  </div>

                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div className="w-8 h-8 bg-primary-200 rounded-full" /> <p>Associated User</p>
                  </div>

                  <div className="flex flex-row gap-2 items-center justify-start w-full">
                    <div className="w-8 h-8 bg-primary-200 rounded-full" /> <p>Associated User</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTask;
