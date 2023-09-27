"use client";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "../../../context";
import useMessage from "../hooks/useMessage";
import Message from "./Message";

import {
  AiOutlineBell,
  AiOutlineBuild,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineSchedule,
  AiOutlineSetting,
  AiOutlineTeam,
} from "react-icons/ai";

interface UserData {
  email: string;
  image: string;
  is_verified: number;
  name: string;
  surname: string;
  user_uuid: string;
}

const Nav = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = React.useState<UserData>({
    email: "",
    image: "",
    is_verified: 1,
    name: "",
    surname: "",
    user_uuid: "",
  });

  const [isVisible, setIsVisible] = React.useState(false);
  const { message, handleMessages } = useMessage();
  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const path = usePathname();

  const user = session?.user;

  const toggleIsVisible = (using: "button" | "link") => {
    setIsVisible((prev) => {
      if (using === "button") {
        return !prev;
      } else if (using === "link") {
        // do not close if on laptop view if nav is not closed
        if (window.innerWidth >= 1024) {
          return prev && true;
        } else {
          return false;
        }
      }

      return !prev;
    });
  };

  const logOut = async () => {
    try {
      await signOut({ callbackUrl: "/", redirect: true });
    } catch (error: any) {
      console.log(error);
      handleMessages(true, error?.response?.data, "error");
    }
  };

  const getUser = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/users/${user?.uuid}`, { headers: { Authorization: user?.token } });

      if (data) {
        setUserData(data);
      }
    } catch (error: any) {
      console.log(error);
      handleMessages(true, error?.response?.data, "error");
    }
  }, [url, user?.token, user?.uuid, handleMessages]);

  React.useEffect(() => {
    if (user?.token) {
      getUser();
    }
  }, [user?.token, getUser]);

  return (
    <div className="flex flex-row h-full">
      {message.active ? <Message message={message} handleMessages={handleMessages} /> : null}

      <div
        className={`fixed  top-0 left-0 w-full h-full z-20 l-s:z-0 bg-white px-4 py-7 flex 
                    flex-col gap-10 t:w-6/12 l-s:border-r-[1px] l-s:static animate-fadeIn transition-all 
                    duration-75 overflow-y-auto cstm-scrollbar overflow-x-clip ${
                      isVisible ? "flex l-s:w-[20rem]" : "hidden l-s:flex l-s:w-[6rem]"
                    } `}
      >
        <div className={`flex flex-row gap-2 items-center justify-center relative px-2.5`}>
          <button
            onClick={() => toggleIsVisible("button")}
            className={`p-2 border-[1px] rounded-full border-inherit ${isVisible ? "mr-auto" : "l-s:mx-auto"}`}
          >
            {isVisible ? (
              <AiOutlineClose className="text-lg text-secondary-300" />
            ) : (
              <AiOutlineMenu className="text-lg text-secondary-300" />
            )}
          </button>

          <p
            className={`font-black text-lg text-primary-500 mr-auto absolute left-2/4 -translate-x-2/4
                        ${isVisible ? "l-s:flex" : "l-s:hidden"}`}
          >
            SynchroFlow
          </p>
        </div>

        <div className="w-full flex flex-col gap-5">
          <Link
            onClick={() => toggleIsVisible("link")}
            href="/hub"
            className={`flex flex-row items-center justify-center gap-4 
                      w-full p-4 hover:bg-neutral-200 rounded-lg text-secondary-500 transition-all ${
                        path === "/hub"
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <div>
              <AiOutlineBuild className="text-2xl" />
            </div>
            <p className={`font-medium mr-auto ${isVisible ? "l-s:flex" : "l-s:hidden"}`}>Dashboard</p>
          </Link>

          <Link
            onClick={() => toggleIsVisible("link")}
            href="/hub/tasks"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4 
                      hover:bg-neutral-200 rounded-lg text-secondary-500 transition-all ${
                        path?.includes("tasks")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <div>
              <AiOutlineSchedule className="text-2xl" />
            </div>
            <p className={`font-medium mr-auto ${isVisible ? "l-s:flex" : "l-s:hidden"}`}>Tasks</p>
          </Link>

          <Link
            onClick={() => toggleIsVisible("link")}
            href="/hub/associates"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4 
                      hover:bg-neutral-200 rounded-lg text-secondary-500 transition-all ${
                        path?.includes("associates")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <div>
              <AiOutlineTeam className="text-2xl" />
            </div>
            <p className={`font-medium mr-auto ${isVisible ? "l-s:flex" : "l-s:hidden"}`}>Associates</p>
          </Link>

          <Link
            onClick={() => toggleIsVisible("link")}
            href="/hub/messages"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4 
                      hover:bg-neutral-200 rounded-lg text-secondary-500 transition-all ${
                        path?.includes("messages")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <div>
              <AiOutlineMail className="text-2xl" />
            </div>
            <p className={`font-medium mr-auto ${isVisible ? "l-s:flex" : "l-s:hidden"}`}>Messages</p>
          </Link>

          <Link
            onClick={() => toggleIsVisible("link")}
            href="/hub/settings"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4 
                      hover:bg-neutral-200 rounded-lg text-secondary-500 transition-all ${
                        path?.includes("settings")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      } mt-auto`}
          >
            <div>
              <AiOutlineSetting className="text-2xl" />
            </div>
            <p className={`font-medium mr-auto ${isVisible ? "l-s:flex" : "l-s:hidden"}`}>Settings</p>
          </Link>
        </div>

        <button
          onClick={logOut}
          className="flex flex-row items-center justify-center gap-4 w-full p-4 hover:bg-neutral-200 rounded-lg
                        text-secondary-500 transition-all opacity-50 mt-auto"
        >
          <div>
            <AiOutlineLogout className="text-2xl rotate-180" />
          </div>
          <p className={`font-medium mr-auto ${isVisible ? "l-s:flex" : "l-s:hidden"}`}>Log Out</p>
        </button>
      </div>

      <div
        className={`top-0 right-0 w-6/12 h-full animate-fadeIn
                t:bg-secondary-900 t:bg-opacity-20 l-s:hidden z-20
                ${isVisible ? "fixed" : "hidden"}`}
      />

      <div className="flex flex-col flex-1 w-full relative z-0">
        <div
          className="w-full p-7 border-b-[1px] border-b-secondary-100  
                  flex flex-row items-center justify-center gap-5 bg-white l-s:bg-transparent transition-all
                  flex-1"
        >
          <div className="flex-col hidden l-s:flex ">
            <p className="font-light text-xs">Welcome,</p>
            <p className="font-bold">
              {userData.name} {userData.surname}
            </p>
          </div>

          <button
            onClick={() => toggleIsVisible("button")}
            className="p-2 border-[1px] rounded-full border-inherit mr-auto l-s:hidden"
          >
            <AiOutlineMenu className="text-lg text-secondary-300 " />
          </button>

          <button className="p-2 border-[1px] rounded-full border-inherit relative cursor-pointer l-s:ml-auto">
            <AiOutlineBell className="text-lg text-secondary-300" />
            <div className="w-2 h-2 bg-red-500 absolute rounded-full top-2 right-2" />
          </button>

          <button
            style={{ backgroundImage: userData?.image ? `url(${userData?.image})` : undefined }}
            className="w-9 h-9 min-w-[2.25rem] min-h-[2.25rem] bg-secondary-200 
                rounded-full bg-center bg-cover"
          />
        </div>

        <div
          className="w-full h-full flex flex-col overflow-y-auto justify-start 
                    cstm-scrollbar bg-neutral-100"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Nav;
