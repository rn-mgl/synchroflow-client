"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import Loading from "@/components//global/Loading";
import Message from "@/components//global/Message";
import useDisable from "@/components//hooks/useDisable";
import useLoader from "@/components//hooks/useLoading";
import usePopUpMessage from "@/components//hooks/usePopUpMessage";
import TextComp from "@/components//input/TextComp";

import forgot from "@/public//auth/ForgotPassword.svg";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { AiOutlineUser } from "react-icons/ai";

const Forgot = () => {
  const [userCredentials, setUserCredentials] = React.useState({
    candidateEmail: "",
    candidateName: "",
    candidateSurname: "",
  });

  const { message, handleMessages } = usePopUpMessage();
  const { isLoading, handleLoader } = useLoader();
  const { disable, handleDisable } = useDisable();

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession();
  const router = useRouter();

  const handleUserCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const forgetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);
    handleDisable(true);

    const { candidateEmail, candidateName, candidateSurname } = userCredentials;

    try {
      const { data } = await axios.post(`${url}/password/forgot`, {
        candidateEmail,
        candidateName,
        candidateSurname,
      });

      if (data) {
        router.push("/sending?purpose=reset");
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
          onSubmit={(e) => forgetPassword(e)}
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
            <p className="text-xs">Email</p>

            <TextComp
              name="candidateEmail"
              placeholder="Enter your email"
              value={userCredentials.candidateEmail}
              Icon={AiOutlineUser}
              onChange={handleUserCredentials}
              required={true}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Name</p>
            <TextComp
              name="candidateName"
              placeholder="Enter your name"
              value={userCredentials.candidateName}
              Icon={AiOutlineUser}
              onChange={handleUserCredentials}
              required={true}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Surname</p>

            <TextComp
              name="candidateSurname"
              placeholder="Enter your surname"
              value={userCredentials.candidateSurname}
              Icon={AiOutlineUser}
              onChange={handleUserCredentials}
              required={true}
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
            src={forgot}
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

export default Forgot;
