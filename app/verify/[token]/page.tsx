"use client";
import rejected from "@/public//auth/Rejected.svg";
import verified from "@/public//auth/Verified.svg";
import verifying from "@/public//auth/Verifying.svg";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useGlobalContext } from "../../../context";
import { BsArrowRight } from "react-icons/bs";
import usePopUpMessage from "@/components//hooks/usePopUpMessage";
import Message from "@/components//global/Message";

const VERIFICATION_STATUS = {
  verifying: "Hello there, we are currently verifying your account.",
  verified: "Congratulations! Your account is now verified.",
  rejected:
    "Sorry, the account was not registered. This could be due to an illegitimate token.",
};

const Verify = () => {
  const [status, setStatus] = React.useState("verifying");

  const url = process.env.API_URL;
  const params = useParams();
  const { message, handleMessages } = usePopUpMessage();

  const verifyAccount = React.useCallback(async () => {
    try {
      const { data } = await axios.patch(`${url}/auth/verify/${params?.token}`);

      if (data) {
        setStatus("verified");
      }
    } catch (error: any) {
      console.log(error);
      setStatus("rejected");
      handleMessages(true, error?.response?.data, "error");
    }
  }, [url, params?.token, handleMessages]);

  React.useEffect(() => {
    verifyAccount();
  }, [verifyAccount]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen h-screen bg-white">
      {message.active ? (
        <Message message={message} handleMessages={handleMessages} />
      ) : null}
      <div
        className="max-w-screen-2xl flex flex-col gap-4 justify-center items-center w-full h-full p-4
            t:p-10 l-s:p-20"
      >
        <div className="w-full flex flex-col items-center justify-center">
          <Image
            src={
              status === "verifying"
                ? verifying
                : status === "verified"
                ? verified
                : rejected
            }
            alt="status"
            className="w-96 saturate-150 drop-shadow-md animate-float"
          />
        </div>

        <p className="text-center">
          {VERIFICATION_STATUS[status as keyof object]}
        </p>

        {status === "verified" ? (
          <Link
            href="/login"
            className="bg-primary-500 text-white 
                    font-bold p-2 rounded-md flex flex-row gap-2
                    items-center justify-center"
          >
            Proceed to Login <BsArrowRight />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default Verify;
