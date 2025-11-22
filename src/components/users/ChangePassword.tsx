"use client";

import React from "react";
import { AiOutlineClose, AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import PasswordComp from "../input/PasswordComp";
import axios from "axios";
import { useGlobalContext } from "@/base/src/contexts/context";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

interface ChangePasswordProps {
  toggleCanChangePassword: () => void;
  getUserData: () => Promise<void>;
}

const ChangePassword: React.FC<ChangePasswordProps> = (props) => {
  const [password, setPassword] = React.useState({
    currentPassword: { text: "", isVisible: false },
    newPassword: { text: "", isVisible: false },
    retypedNewPassword: { text: "", isVisible: false },
  });

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();

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

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { newPassword, retypedNewPassword } = password;

    if (newPassword.text !== retypedNewPassword.text) return;

    if (newPassword.text.length < 8) return;

    try {
      const { data } = await axios.patch(
        `${url}/users/${params?.user_uuid}`,
        { password },
        {
          headers: { Authorization: user?.token },
          params: { type: "password" },
        }
      );

      if (data) {
        props.toggleCanChangePassword();
        await props.getUserData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
          bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
          flex flex-col items-center justify-start p-4 t:p-10"
    >
      <form
        onSubmit={(e) => changePassword(e)}
        className="w-full bg-white h-fit rounded-lg flex flex-col p-4 t:p-10 gap-4 shadow-xl
            max-w-screen-m-l overflow-y-auto cstm-scrollbar items-center justify-start my-auto"
      >
        <button
          onClick={props.toggleCanChangePassword}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
            hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Current Password</p>
          <PasswordComp
            name="currentPassword"
            placeholder="Current Password..."
            required={true}
            value={password.currentPassword.text}
            onChange={handlePassword}
            Icon={
              password.currentPassword.isVisible
                ? AiOutlineUnlock
                : AiOutlineLock
            }
            type={password.currentPassword.isVisible ? "text" : "password"}
            viewPassword={() => toggleCanViewPassword("currentPassword")}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">New Password</p>
          <PasswordComp
            name="newPassword"
            placeholder="New Password..."
            required={true}
            value={password.newPassword.text}
            onChange={handlePassword}
            Icon={
              password.newPassword.isVisible ? AiOutlineUnlock : AiOutlineLock
            }
            type={password.newPassword.isVisible ? "text" : "password"}
            viewPassword={() => toggleCanViewPassword("newPassword")}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Retyped New Password</p>
          <PasswordComp
            name="retypedNewPassword"
            placeholder="Retype New Password..."
            required={true}
            value={password.retypedNewPassword.text}
            onChange={handlePassword}
            Icon={
              password.retypedNewPassword.isVisible
                ? AiOutlineUnlock
                : AiOutlineLock
            }
            type={password.retypedNewPassword.isVisible ? "text" : "password"}
            viewPassword={() => toggleCanViewPassword("retypedNewPassword")}
          />
        </div>

        <button
          type="submit"
          className="bg-primary-500 rounded-lg text-white 
                    font-bold p-2 w-full"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
