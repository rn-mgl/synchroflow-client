"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import Loading from "@/components//global/Loading";
import Message from "@/components//global/Message";
import useDisable from "@/src/hooks/useDisable";
import useLoader from "@/src/hooks/useLoading";
import usePopUpMessage from "@/src/hooks/usePopUpMessage";
import PasswordComp from "@/components//input/PasswordComp";

import newPassword from "@/public//auth/NewPassword.svg";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";

const Reset = () => {
  const [password, setPassword] = React.useState({
    newPassword: { text: "", isVisible: false },
    retypedNewPassword: { text: "", isVisible: false },
  });

  const { message, handleMessages } = usePopUpMessage();
  const { isLoading, handleLoader } = useLoader();
  const { disable, handleDisable } = useDisable();

  const url = process.env.NEXT_PUBLIC_API_URL;
  const params = useParams();
  const router = useRouter();

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPassword((prev) => {
      const keyName = name as keyof typeof prev;
      return {
        ...prev,
        [name]: { ...prev[keyName], text: value },
      };
    });
  };

  const toggleCanViewPassword = (name: string | keyof object) => {
    setPassword((prev) => {
      const keyName = name as keyof typeof prev;
      return {
        ...prev,
        [name]: { ...prev[keyName], isVisible: !prev[keyName].isVisible },
      };
    });
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);
    handleDisable(true);

    const { newPassword, retypedNewPassword } = password;

    if (newPassword.text !== retypedNewPassword.text) return;

    try {
      const { data } = await axios.patch(
        `${url}/password/new/${params?.token}`,
        {
          newPassword,
        },
      );

      if (data) {
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      handleLoader(false);
      handleDisable(false);
      handleMessages(
        true,
        axios.isAxiosError(error)
          ? error?.response?.data
          : "An unexpected error occurred.",
        "error",
      );
    }
  };

  return (
    <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full min-h-screen h-screen bg-white">
      {message.active ? (
        <Message message={message} handleMessages={handleMessages} />
      ) : null}
      {isLoading ? <Loading /> : null}

      <div
        className="absolute right-0 bottom-0 bg-secondary-500 w-full h-2/6
                  l-s:h-screen l-s:w-4/12"
      />

      <div
        className="max-w-screen-2xl flex flex-col gap-4 justify-start l-s:justify-center items-center w-full h-full p-4
                t:p-10 l-s:p-20 l-s:flex-row"
      >
        <form
          onSubmit={(e) => resetPassword(e)}
          className="relative z-20 w-full flex flex-col items-center justify-center gap-4 backdrop-blur-md my-auto
                      bg-secondary-300 bg-opacity-10 p-4 rounded-xl border-secondary-300 border-2 border-opacity-30
                      max-w-lg t:p-10"
        >
          <div className="text-left w-full">
            <p className="text-sm text-secondary-500">
              Welcome to SynchroFlow,
            </p>

            <p className="font-black text-2xl text-primary-500 l-s:text-3xl">
              Forgot Password
            </p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">New Password</p>

            <PasswordComp
              name="newPassword"
              placeholder="Enter your new password"
              value={password.newPassword.text}
              Icon={
                password.newPassword.isVisible ? AiOutlineUnlock : AiOutlineLock
              }
              onChange={handlePassword}
              required={true}
              type={password.newPassword.isVisible ? "text" : "password"}
              viewPassword={() => toggleCanViewPassword("newPassword")}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Retyped New Password</p>

            <PasswordComp
              name="retypedNewPassword"
              placeholder="Retype new password"
              value={password.retypedNewPassword.text}
              Icon={
                password.retypedNewPassword.isVisible
                  ? AiOutlineUnlock
                  : AiOutlineLock
              }
              onChange={handlePassword}
              required={true}
              type={password.retypedNewPassword.isVisible ? "text" : "password"}
              viewPassword={() => toggleCanViewPassword("retypedNewPassword")}
            />
          </div>
          <button
            disabled={disable}
            className="bg-primary-500 w-full rounded-md p-2 font-bold text-white 
                      disabled:bg-neutral-500 transition-all"
          >
            Submit
          </button>
        </form>

        <div className="w-full flex-col items-center justify-center hidden l-s:flex max-w-lg">
          <Image
            src={newPassword}
            alt="forgot"
            priority
            draggable={false}
            className="animate-float drop-shadow-md :w-96 saturate-150"
          />
        </div>
      </div>
    </div>
  );
};

export default Reset;
