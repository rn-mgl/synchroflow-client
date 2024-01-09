"use client";
import { useSearchParams } from "next/navigation";
import sending from "@/public//auth/Sending.svg";
import Image from "next/image";

const SENDING_PURPOSE = {
  verify: "We are currently sending a verification link to the account you registered.",
  reset: "We are currently sending a password reset link to the email you entered.",
};

const Sending = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("purpose");

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen h-screen bg-white">
      <div
        className="max-w-screen-2xl flex flex-col gap-4 justify-center items-center w-full h-full p-4
                t:p-10 l-s:p-20 l-s:flex-row"
      >
        <div className="w-full h-full my-auto flex flex-col items-center justify-center gap-4">
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src={sending}
              alt="sending"
              draggable={false}
              className="saturate-150 drop-shadow-md animate-float w-96"
              priority
            />
          </div>

          <div className="flex flex-col items-center justify-center text-center gap-2">
            <p className="font-bold">It may take a minute or two.</p>
            <p>{SENDING_PURPOSE[query as keyof object]} You can close this page after receiving the email.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sending;
