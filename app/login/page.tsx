"use client";

import InputComp from "@/components//input/InputComp";
import login from "@/public//auth/Login.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Login = () => {
  const [loginCredentials, setLoginCredentials] = React.useState({ candidateEmail: "", candidatePassword: "" });

  const handleLoginCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setLoginCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen h-screen bg-white">
      <div
        className="absolute right-0 bottom-0 bg-secondary-500 w-full h-2/6
                  l-s:h-screen l-s:w-4/12"
      />

      <div
        className="max-w-screen-2xl flex flex-col gap-5 justify-start l-s:justify-center items-center w-full h-full p-5 mt-10
                t:p-10 l-s:p-20 l-s:flex-row"
      >
        <form
          className="relative z-20 w-full flex flex-col items-center justify-center gap-5 backdrop-blur-md my-auto
                      bg-secondary-300 bg-opacity-10 p-5 rounded-xl border-secondary-300 border-2 border-opacity-30
                      max-w-lg t:p-10"
        >
          <div className="text-left w-full">
            <p className="text-sm text-secondary-500">Welcome back to SynchroFlow,</p>
            <p className="font-black text-2xl text-primary-500 l-s:text-3xl">Log In</p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Email</p>
            <InputComp
              icon={null}
              name="candidateEmail"
              placeholder="Enter your email"
              type="text"
              value={loginCredentials.candidateEmail}
              onChange={handleLoginCredentials}
              required={true}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Password</p>
            <InputComp
              icon={null}
              name="candidatePassword"
              placeholder="Enter your password"
              type="password"
              value={loginCredentials.candidatePassword}
              onChange={handleLoginCredentials}
              required={true}
            />
          </div>

          <button className="bg-primary-500 w-full rounded-md p-2 font-bold text-white">Submit</button>

          <Link href="/register" className="text-xs text-primary-500 hover:underline transition-all underline-offset-2">
            don&apos;t have an account yet?
          </Link>
        </form>
        <div className="w-full flex-col items-center justify-center hidden l-s:flex max-w-lg">
          <Image
            src={login}
            alt="landing"
            priority
            draggable={false}
            className="animate-float drop-shadow-md :w-96 saturate-150"
          />
        </div>
        B
      </div>
    </div>
  );
};

export default Login;
