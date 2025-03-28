import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface DeleteConfirmationProps {
  title: string;
  message: string;
  apiRoute: string;
  customDelete?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  toggleConfirmation: () => void;
  refetchData?: (() => Promise<void>) | (() => void);
  redirectLink?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = (props) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const deleteData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`${url}/${props.apiRoute}`, {
        headers: { Authorization: user?.token },
      });
      if (data) {
        if (props.refetchData) {
          await props.refetchData();
        }
        if (props.redirectLink) {
          router.push(props.redirectLink);
        }
        props.toggleConfirmation();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-40 animate-fadeIn
        bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
        flex flex-col items-center justify-start p-4 t:p-10"
    >
      <form
        onSubmit={(e) => {
          props.customDelete ? props.customDelete(e) : deleteData(e);
        }}
        className="w-full bg-white h-fit rounded-lg flex flex-col gap-4 
                  max-w-screen-m-l overflow-y-auto cstm-scrollbar items-center justify-start
                  my-auto text-center"
      >
        <div className="flex flex-col items-center justify-end w-full border-b-[1px] p-4">
          <button
            onClick={props.toggleConfirmation}
            type="button"
            className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
          >
            <AiOutlineClose className="text-secondary-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4 items-center justify-center">
          <p className="font-semibold text-primary-500 text-sm">
            {props.title}
          </p>
          <p className="text-xs">{props.message}</p>

          <div className="w-full flex flex-row gap-4">
            <button
              type="button"
              onClick={props.toggleConfirmation}
              className="w-full rounded-md font-medium  
                        p-2 text-sm text-primary-500 border-2 border-primary-500"
            >
              No
            </button>
            <button
              type="submit"
              className="w-full rounded-md font-medium bg-primary-500 
                        p-2 text-sm text-white border-2 border-primary-500"
            >
              Yes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeleteConfirmation;
