"use client";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/base/src/contexts/context";
import usePopUpMessage from "../hooks/usePopUpMessage";
import Message from "./Message";

import {
  AiOutlineBell,
  AiOutlineBuild,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineSchedule,
  AiOutlineSend,
  AiOutlineSetting,
  AiOutlineTeam,
} from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { localizeDate, localizeTime } from "../utils/dateUtils";
import useNotification from "../hooks/useNotification";
import { nanoid } from "nanoid";

interface UserData {
  email: string;
  image: string;
  is_verified: number;
  name: string;
  surname: string;
  user_uuid: string;
}

const Nav = ({ children }: { children: React.ReactNode }) => {
  const [navIsVisible, setNavIsVisible] = React.useState(false);
  const [userData, setUserData] = React.useState<UserData>({
    email: "",
    image: "",
    is_verified: 1,
    name: "",
    surname: "",
    user_uuid: "",
  });

  const {
    notificationIsVisible,
    notifications,
    checkedNotifications,
    toggleNotificationIsVisible,
    toggleCheckedNotifications,
    getNotifications,
  } = useNotification();
  const { message, handleMessages } = usePopUpMessage();

  const { socket } = useGlobalContext();
  const { data: session } = useSession();
  const path = usePathname();
  const user = session?.user;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const toggleNavIsVisible = (using: "button" | "link") => {
    setNavIsVisible((prev) => {
      if (using === "button") {
        return !prev;
      } else if (using === "link") {
        // will not close if on laptop view if nav is not closed
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
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/users/${user?.uuid}`, {
          headers: { Authorization: user?.token },
        });

        if (data) {
          setUserData(data);
        }
      } catch (error: any) {
        console.log(error);
        handleMessages(true, error?.response?.data, "error");
      }
    }
  }, [url, user?.token, user?.uuid, handleMessages]);

  const mappedNotifications = notifications.map((notification, index) => {
    const action = notification.purpose.includes("group member")
      ? "added you as a"
      : notification.purpose.includes("message") ||
        notification.purpose.includes("invite")
      ? "sent a"
      : "notification on";

    return (
      <div
        key={nanoid()}
        className="w-full p-2 rounded-md bg-neutral-50 flex flex-col items-center justify-center gap-2"
      >
        <div className="flex flex-row w-full items-center justify-between gap-4">
          <div
            style={{ backgroundImage: `url(${notification.from_image})` }}
            className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] bg-center bg-cover rounded-full bg-primary-100"
          />

          <p className="text-sm w-full">
            <span className="font-semibold">
              {notification.name} {notification.surname}{" "}
            </span>{" "}
            {action}{" "}
            <span className="capitalize font-semibold">
              {notification.purpose}
            </span>{" "}
          </p>
        </div>

        <div className="flex flex-row w-full items-center justify-start gap-4">
          <div
            className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] bg-center bg-cover rounded-full 
                    bg-gradient-to-br from-primary-100 to-primary-400 flex flex-col items-center
                    justify-center"
          >
            {notification.purpose.includes("invite") ? (
              <AiOutlineMail className="text-secondary-500" />
            ) : notification.purpose === "group member" ? (
              <MdGroupAdd className="text-secondary-500" />
            ) : notification.purpose === "private message" ? (
              <AiOutlineSend className="text-secondary-500" />
            ) : (
              <IoNotifications className="text-secondary-500" />
            )}
          </div>
          <p className="text-sm truncate max-w-[25ch] ">{notification.title}</p>
        </div>

        <p className="text-xs ml-auto">
          {localizeDate(notification.notif_date, false)} |{" "}
          {localizeTime(notification.notif_date)}
        </p>
      </div>
    );
  });

  React.useEffect(() => {
    getUser();
  }, [getUser]);

  React.useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  React.useEffect(() => {
    if (!user?.uuid || !socket) return;

    const handle = () => {
      socket?.emit("rejoin_user_uuid", { room: user?.uuid });
    };

    socket?.on("room_rejoin", handle);

    return () => {
      socket?.off("room_rejoin", handle);
    };
  }, [socket, user?.uuid]);

  return (
    <div className="flex flex-row h-full">
      {message.active ? (
        <Message message={message} handleMessages={handleMessages} />
      ) : null}

      <div
        className={`fixed  top-0 left-0 w-full h-full z-20 l-s:z-0 bg-white px-4 py-7 flex 
                    flex-col gap-8 t:w-6/12 l-s:border-r-[1px] l-s:static animate-fadeIn transition-all 
                    duration-75 overflow-y-auto cstm-scrollbar overflow-x-clip ${
                      navIsVisible
                        ? "flex l-s:w-72 l-s:min-w-[18rem]"
                        : "hidden l-s:flex l-s:w-[6rem] l-s:min-w-[6rem]"
                    } `}
      >
        <div className="flex flex-row gap-2 items-center justify-center relative px-2.5">
          <button
            onClick={() => toggleNavIsVisible("button")}
            className={`p-2 border-[1px] rounded-full border-inherit ${
              navIsVisible ? "mr-auto" : "l-s:mx-auto"
            }`}
          >
            <AiOutlineMenu className="text-lg text-secondary-300" />
          </button>

          <p
            className={`font-black text-lg text-primary-500 mr-auto absolute left-2/4 -translate-x-2/4
                        ${navIsVisible ? "l-s:flex" : "l-s:hidden"}`}
          >
            SynchroFlow
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <Link
            onClick={() => toggleNavIsVisible("link")}
            href="/hub"
            className={`flex flex-row items-center justify-center gap-4
                      w-full p-4 hover:bg-neutral-150 rounded-lg text-secondary-500 transition-all 
                      active:bg-gradient-to-br active:from-primary-100 active:to-primary-500
                      ${
                        path === "/hub"
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <div>
              <AiOutlineBuild className="text-2xl" />
            </div>
            <p
              className={`font-medium mr-auto ${
                navIsVisible ? "l-s:flex" : "l-s:hidden"
              }`}
            >
              Dashboard
            </p>
          </Link>

          <Link
            onClick={() => toggleNavIsVisible("link")}
            href="/hub/tasks"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4
                      hover:bg-neutral-150 rounded-lg text-secondary-500 transition-all 
                      active:bg-gradient-to-br active:from-primary-100 active:to-primary-500
                      ${
                        path?.includes("tasks")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <div>
              <AiOutlineSchedule className="text-2xl" />
            </div>
            <p
              className={`font-medium mr-auto w-full ${
                navIsVisible ? "l-s:flex" : "l-s:hidden"
              }`}
            >
              Tasks
            </p>
          </Link>

          <Link
            onClick={() => toggleNavIsVisible("link")}
            href="/hub/associates"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4 
                      hover:bg-neutral-150 rounded-lg text-secondary-500 transition-all 
                      active:bg-gradient-to-br active:from-primary-100 active:to-primary-500
                      ${
                        path?.includes("associates")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <div>
              <AiOutlineTeam className="text-2xl" />
            </div>
            <p
              className={`font-medium mr-auto ${
                navIsVisible ? "l-s:flex" : "l-s:hidden"
              }`}
            >
              Associates
            </p>
          </Link>

          <Link
            onClick={() => toggleNavIsVisible("link")}
            href="/hub/messages/private/me"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4 
                      hover:bg-neutral-150 rounded-lg text-secondary-500 transition-all 
                      active:bg-gradient-to-br active:from-primary-100 active:to-primary-500
                      ${
                        path?.includes("messages")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <div>
              <AiOutlineSend className="text-2xl" />
            </div>
            <p
              className={`font-medium mr-auto ${
                navIsVisible ? "l-s:flex" : "l-s:hidden"
              }`}
            >
              Messages
            </p>
          </Link>

          <Link
            onClick={() => toggleNavIsVisible("link")}
            href="/hub/invites"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4
                      hover:bg-neutral-150 rounded-lg text-secondary-500 transition-all 
                      active:bg-gradient-to-br active:from-primary-100 active:to-primary-500
                      ${
                        path?.includes("invites")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      }`}
          >
            <span>
              <AiOutlineMail className="text-2xl" />
            </span>
            <span
              className={`font-medium mr-auto ${
                navIsVisible ? "l-s:flex" : "l-s:hidden"
              }`}
            >
              Invites
            </span>
          </Link>

          <Link
            onClick={() => toggleNavIsVisible("link")}
            href="/hub/settings"
            className={`flex flex-row items-center justify-center gap-4 w-full p-4 
                      hover:bg-neutral-150 rounded-lg text-secondary-500 transition-all 
                      active:bg-gradient-to-br active:from-primary-100 active:to-primary-500
                      ${
                        path?.includes("settings")
                          ? "opacity-100 bg-gradient-to-br from-primary-500 to-primary-900 text-white"
                          : "opacity-50"
                      } mt-auto`}
          >
            <div>
              <AiOutlineSetting className="text-2xl" />
            </div>
            <p
              className={`font-medium mr-auto ${
                navIsVisible ? "l-s:flex" : "l-s:hidden"
              }`}
            >
              Settings
            </p>
          </Link>
        </div>

        <button
          onClick={logOut}
          className="flex flex-row items-center justify-center gap-4 w-full p-4 hover:bg-neutral-150 rounded-lg
                        text-secondary-500 transition-all opacity-50 mt-auto"
        >
          <div>
            <AiOutlineLogout className="text-2xl rotate-180" />
          </div>
          <p
            className={`font-medium mr-auto ${
              navIsVisible ? "l-s:flex" : "l-s:hidden"
            }`}
          >
            Log Out
          </p>
        </button>
      </div>

      <div
        className={`top-0 right-0 w-6/12 h-full animate-fadeIn
                t:bg-secondary-900 t:bg-opacity-20 l-s:hidden z-20
                ${navIsVisible ? "fixed" : "hidden"}`}
      />

      <div className="flex flex-col flex-1 w-full relative z-0">
        <div
          className="w-full p-7 border-b-[1px] border-b-secondary-100  
                  flex flex-row items-center justify-center gap-4 bg-white transition-all
                  flex-1"
        >
          <div className="flex-col hidden l-s:flex ">
            <p className="font-light text-xs">Welcome,</p>
            <p className="font-bold">
              {userData.name} {userData.surname}
            </p>
          </div>

          <button
            onClick={() => toggleNavIsVisible("button")}
            className="p-2 border-[1px] rounded-full border-inherit mr-auto l-s:hidden"
          >
            <AiOutlineMenu className="text-lg text-secondary-300 " />
          </button>

          <button
            onClick={async () => {
              await getNotifications();
              toggleNotificationIsVisible();
              toggleCheckedNotifications(true);
            }}
            className="p-2 border-[1px] rounded-full border-inherit relative cursor-pointer l-s:ml-auto"
          >
            <AiOutlineBell className="text-lg text-secondary-300" />
            {!checkedNotifications ? (
              <div className="w-2 h-2 bg-red-500 absolute rounded-full top-2 right-2" />
            ) : null}
          </button>

          <Link
            href={`/hub/profile/${userData?.user_uuid}`}
            style={{
              backgroundImage: userData?.image
                ? `url(${userData?.image})`
                : undefined,
            }}
            className={`w-9 h-9 min-w-[2.25rem] min-h-[2.25rem] bg-secondary-200 
                      rounded-full bg-center bg-cover transition-all ${
                        path?.includes("profile") &&
                        "border-4 border-primary-500"
                      }`}
          />
        </div>

        {notificationIsVisible ? (
          <div
            className="w-11/12 h-96 max-h-[24rem] bg-neutral-100 shadow-xl absolute top-24 left-2/4 -translate-x-2/4 z-50 
                      overflow-y-hidden animate-fadeIn rounded-lg flex flex-col items-center justify-start p-4 gap-2
                       t:max-w-screen-m-l t:left-auto t:-translate-x-0 t:right-16"
          >
            <p className="w-full text-lg text-left font-semibold">
              Notifications
            </p>

            <div className="w-full h-[1px] bg-secondary-300" />

            <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-y-auto cstm-scrollbar-2">
              {mappedNotifications}
            </div>
          </div>
        ) : null}

        <div
          className="w-full h-screen flex flex-col overflow-y-auto justify-start 
                    cstm-scrollbar bg-neutral-50 relative"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Nav;
