"use client";

import Loading from "@/components//global/Loading";
import Message from "@/components//global/Message";
import useDisable from "@/components//hooks/useDisable";
import useLoader from "@/components//hooks/useLoading";
import useMessage from "@/components//hooks/useMessage";
import { useVisiblePassword } from "@/components//hooks/useVisiblePassword";
import PasswordComp from "@/components//input/PasswordComp";
import TextComp from "@/components//input/TextComp";

import login from "@/public//auth/Login.svg";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from "react-icons/ai";

const Login = () => {
  const [loginCredentials, setLoginCredentials] = React.useState({ candidateEmail: "", candidatePassword: "" });
  const [firstLogin, setFirstLogin] = React.useState(false);

  const { message, handleMessages } = useMessage();
  const { visiblePassword, toggleVisiblePassword } = useVisiblePassword();
  const { isLoading, handleLoader } = useLoader();
  const { disable, handleDisable } = useDisable();

  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

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

  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);
    handleDisable(true);
    setFirstLogin(true);

    signOut({ redirect: false });

    try {
      const data = await signIn("credentials", {
        candidateEmail: loginCredentials.candidateEmail,
        candidatePassword: loginCredentials.candidatePassword,
        redirect: false,
      });
      if (!data?.ok) {
        handleMessages(true, "The email and password does not match.", "error");
        handleLoader(false);
        handleDisable(false);
        setFirstLogin(false);
      }
    } catch (error: any) {
      console.log(error);
      handleLoader(false);
      handleDisable(false);
      setFirstLogin(false);
      handleMessages(true, error?.response?.data, "error");
    }
  };

  React.useEffect(() => {
    if (firstLogin && user?.token) {
      handleLoader(false);
      handleDisable(false);

      router.push("/hub");
    }
  }, [user?.token, router, firstLogin, handleDisable, handleLoader]);

  return (
    <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full min-h-screen h-screen bg-white">
      {message.active ? <Message message={message} handleMessages={handleMessages} /> : null}
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
          onSubmit={(e) => submitLogin(e)}
          className="relative z-20 w-full flex flex-col items-center justify-center gap-4 backdrop-blur-md my-auto
                      bg-secondary-300 bg-opacity-10 p-4 rounded-xl border-secondary-300 border-2 border-opacity-30
                      max-w-lg t:p-10"
        >
          <div className="text-left w-full">
            <p className="text-sm text-secondary-500">Welcome back to SynchroFlow,</p>

            <p className="font-black text-2xl text-primary-500 l-s:text-3xl">Log In</p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Email</p>

            <TextComp
              name="candidateEmail"
              placeholder="Enter your email"
              value={loginCredentials.candidateEmail}
              Icon={AiOutlineUser}
              onChange={handleLoginCredentials}
              required={true}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <p className="text-xs">Password</p>

            <PasswordComp
              name="candidatePassword"
              placeholder="Enter your password"
              type={visiblePassword ? "text" : "password"}
              value={loginCredentials.candidatePassword}
              Icon={visiblePassword ? AiOutlineEyeInvisible : AiOutlineEye}
              onChange={handleLoginCredentials}
              viewPassword={toggleVisiblePassword}
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
      </div>
    </div>
  );
};

export default Login;
