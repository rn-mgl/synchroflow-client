"use client";
import useLoader from "@/src/hooks/useLoading";
import usePopUpMessage from "@/src/hooks/usePopUpMessage";
import TextComp from "@/components//input/TextComp";
import signup from "@/public//auth/Signup.svg";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import axios from "axios";
import isEmail from "validator/lib/isEmail";

import Loading from "@/components//global/Loading";
import Message from "@/components//global/Message";
import useDisable from "@/src/hooks/useDisable";
import PasswordComp from "@/components//input/PasswordComp";
import { useRouter } from "next/navigation";

import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
  AiOutlineMail,
} from "react-icons/ai";
import { useVisiblePassword } from "@/src/hooks/useVisiblePassword";

const Register = () => {
  const [registerCredentials, setRegisterCredentials] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const { message, handleMessages } = usePopUpMessage();
  const { isLoading, handleLoader } = useLoader();
  const { disable, handleDisable } = useDisable();
  const { visiblePassword, toggleVisiblePassword } = useVisiblePassword();

  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleRegisterCredentials = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setRegisterCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitRegistration = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    handleLoader(true);
    handleDisable(true);

    if (!isEmail(registerCredentials.email)) {
      handleMessages(true, "Please enter a valid email.", "warning");
      handleLoader(false);
      handleDisable(false);
      return;
    }

    if (registerCredentials.password.length < 8) {
      handleMessages(
        true,
        "Password length must not be less than 8 characters.",
        "warning",
      );
      handleLoader(false);
      handleDisable(false);
      return;
    }

    try {
      const { data } = await axios.post(`${url}/auth/register`, {
        registerCredentials,
      });

      if (data) {
        router.push("/sending?purpose=verify");
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
      {isLoading ? <Loading /> : null}
      {message.active && (
        <Message message={message} handleMessages={handleMessages} />
      )}

      <div
        className="absolute right-0 bottom-0 bg-primary-500 w-full h-2/6
                  l-s:h-full l-s:w-4/12"
      />
      <div
        className="max-w-screen-2xl flex flex-col gap-4 justify-start l-s:justify-center items-center w-full h-full p-4
                t:p-10 l-s:p-20 l-s:flex-row"
      >
        <form
          onSubmit={(e) => submitRegistration(e)}
          className="relative z-20 w-full flex flex-col items-center justify-center gap-4 backdrop-blur-md my-auto
                      bg-primary-300 bg-opacity-10 p-4 rounded-xl border-primary-300 border-2 border-opacity-30
                      max-w-lg t:p-10"
        >
          <div className="text-left w-full">
            <p className="text-sm text-secondary-500">
              Welcome to SynchroFlow,
            </p>
            <p className="font-black text-2xl text-primary-500 l-s:text-3xl">
              Register
            </p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Name</p>
            <TextComp
              Icon={AiOutlineUser}
              name="name"
              placeholder="Enter your name"
              value={registerCredentials.name}
              onChange={handleRegisterCredentials}
              required={true}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Surname</p>
            <TextComp
              Icon={AiOutlineUser}
              name="surname"
              placeholder="Enter your surname"
              value={registerCredentials.surname}
              onChange={handleRegisterCredentials}
              required={true}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Email</p>
            <TextComp
              Icon={AiOutlineMail}
              name="email"
              placeholder="Enter your email"
              value={registerCredentials.email}
              onChange={handleRegisterCredentials}
              required={true}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Password</p>
            <PasswordComp
              Icon={visiblePassword ? AiOutlineEyeInvisible : AiOutlineEye}
              viewPassword={toggleVisiblePassword}
              name="password"
              placeholder="Enter your password"
              type={visiblePassword ? "text" : "password"}
              value={registerCredentials.password}
              onChange={handleRegisterCredentials}
              required={true}
            />
          </div>

          <button
            disabled={disable}
            className="bg-secondary-500 w-full rounded-md p-2 
                      font-bold text-white disabled:bg-neutral-500 transition-all"
          >
            Submit
          </button>

          <Link
            href="/login"
            className="text-xs text-secondary-500 hover:underline transition-all underline-offset-2"
          >
            already have an account?
          </Link>
        </form>

        <div className="w-full flex-col items-center justify-center hidden l-s:flex max-w-lg">
          <Image
            src={signup}
            alt="landing"
            priority
            draggable={false}
            className="animate-float drop-shadow-md :w-96 saturate-150"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
