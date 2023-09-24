"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

import {
  AiOutlineBell,
  AiOutlineBuild,
  AiOutlineClose,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineSchedule,
  AiOutlineSetting,
  AiOutlineTeam,
} from "react-icons/ai";
import { useGlobalContext } from "../../../context";
import useMessage from "../hooks/useMessage";
import Message from "./Message";

interface UserData {
  email: string;
  image: string;
  is_verified: number;
  name: string;
  surname: string;
  user_uuid: string;
}

const SideNav = () => {
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

  const user = session?.user;

  const toggleIsVisible = () => {
    setIsVisible((prev) => !prev);
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
    <>
      <div className="py-8 px-5 border-b-[1px] border-b-secondary-100 flex flex-row items-center justify-center gap-5">
        {message.active ? <Message message={message} handleMessages={handleMessages} /> : null}
        <button onClick={toggleIsVisible} className="p-2 border-[1px] rounded-full border-inherit mr-auto">
          <AiOutlineMenu className="text-lg text-secondary-300" />
        </button>

        <button className="p-2 border-[1px] rounded-full border-inherit relative">
          <AiOutlineBell className="text-lg text-secondary-300" />
          <div className="w-2 h-2 bg-red-500 absolute rounded-full top-2 right-2" />
        </button>

        <button
          style={{ backgroundImage: userData?.image ? `url(${userData?.image})` : undefined }}
          className="w-9 h-9 min-w-[2.25rem] min-h-[2.25rem] bg-secondary-200 
                rounded-full bg-center bg-cover"
        />
      </div>

      {isVisible ? (
        <div className="absolute top-0 left-0 w-full h-full bg-white px-5 py-8 animate-fadeIn flex flex-col gap-10">
          <div className="flex flex-row gap-2 items-center justify-center relative">
            <button onClick={toggleIsVisible} className="p-2 border-[1px] rounded-full border-inherit mr-auto">
              <AiOutlineClose className="text-lg text-secondary-300" />
            </button>
            <p className="font-black text-lg text-primary-500 mr-auto absolute left-2/4 -translate-x-2/4">
              SynchroFlow
            </p>
          </div>

          <div className="w-full flex flex-col gap-5">
            <div
              className="flex flex-row items-center justify-center gap-4 w-full p-4 hover:bg-neutral-200 rounded-lg
                        text-secondary-500 transition-all opacity-50"
            >
              <div>
                <AiOutlineBuild className="text-2xl" />
              </div>
              <p className="font-medium mr-auto">Dashboard</p>
            </div>

            <div
              className="flex flex-row items-center justify-center gap-4 w-full p-4 hover:bg-neutral-200 rounded-lg
                        text-secondary-500 transition-all opacity-50"
            >
              <div>
                <AiOutlineSchedule className="text-2xl" />
              </div>
              <p className="font-medium mr-auto">Tasks</p>
            </div>

            <div
              className="flex flex-row items-center justify-center gap-4 w-full p-4 hover:bg-neutral-200 rounded-lg
                        text-secondary-500 transition-all opacity-50"
            >
              <div>
                <AiOutlineTeam className="text-2xl" />
              </div>
              <p className="font-medium mr-auto">Associates</p>
            </div>

            <div
              className="flex flex-row items-center justify-center gap-4 w-full p-4 hover:bg-neutral-200 rounded-lg
                        text-secondary-500 transition-all opacity-50"
            >
              <div>
                <AiOutlineMail className="text-2xl" />
              </div>
              <p className="font-medium mr-auto">Message</p>
            </div>

            <div
              className="flex flex-row items-center justify-center gap-4 w-full p-4 hover:bg-neutral-200 rounded-lg
                        text-secondary-500 transition-all opacity-50"
            >
              <div>
                <AiOutlineSetting className="text-2xl" />
              </div>
              <p className="font-medium mr-auto">Settings</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SideNav;
