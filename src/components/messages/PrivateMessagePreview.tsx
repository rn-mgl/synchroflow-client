"use client";

import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { BsCheck, BsCheckAll, BsDot } from "react-icons/bs";
import { localizeDate } from "../utils/dateUtils";

interface PrivateMessagePreviewProps {
  image: string | null;
  name: string;
  surname: string;
  latestMessage: string;
  latestFile: string;
  status: "sent" | "read" | "unread";
  dateSent: string;
  isSelected: boolean;
  isSender: boolean;
  messageRoom: string;
  handleSelectedMessageRoom: () => void;
}

const PrivateMessagePreview: React.FC<PrivateMessagePreviewProps> = (props) => {
  const [latestMessage, setLatestMessage] = React.useState({
    message: "",
    message_file: "",
    date_sent: "",
    message_from: -1,
  });

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getLatestMessage = React.useCallback(async () => {
    if (user?.token && props.messageRoom) {
      try {
        const { data } = await axios.get(`${url}/private_messages`, {
          headers: { Authorization: user?.token },
          params: { messageRoom: props.messageRoom, type: "latest" },
        });
        if (data) {
          setLatestMessage(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, props.messageRoom, user?.token]);

  React.useEffect(() => {
    getLatestMessage();
  }, [getLatestMessage]);

  return (
    <button
      onClick={props.handleSelectedMessageRoom}
      className={`w-full p-2 rounded-lg hover:bg-neutral-50 
                flex flex-row items-center gap-2 transition-all
                ${props.isSelected && "bg-primary-100"}`}
    >
      <div
        style={{ backgroundImage: `url(${props.image})` }}
        className={`min-h-[3rem] min-w-[3rem] rounded-full bg-primary-100
                  bg-center bg-contain ${props.isSelected && "bg-white"}`}
      />
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="flex flex-row justify-center items-center w-full gap-4">
          <p className="font-bold text-sm max-w-[12ch] truncate mr-auto  l-l:max-w-[20ch]">
            {props.name} {props.surname}
          </p>

          <div>
            {props.status === "read" ? (
              <BsCheckAll className="text-primary-500 text-xl" />
            ) : props.status === "sent" ? (
              <BsCheck className="text-primary-500 text-xl" />
            ) : props.status === "unread" ? (
              <BsDot className="text-error-500 text-xl" />
            ) : (
              <BsDot className="text-neutral-400 text-xl" />
            )}
          </div>
        </div>

        <div className="flex flex-row justify-between items-center w-full text-xs">
          <p className="truncate max-w-[10ch] t:max-w-[40ch] l-s:max-w-[10ch] l-l:max-w-[25ch]">
            <span className="font-medium"> {latestMessage.message_from === user?.id && "You: "}</span>
            <span>
              {latestMessage.message ? (
                latestMessage.message
              ) : latestMessage.message_file ? (
                <i>sent an attachement</i>
              ) : (
                <i>no messages yet</i>
              )}
            </span>
          </p>

          <p className="text-xs italic">
            {latestMessage.date_sent ? localizeDate(latestMessage.date_sent, true) : "mm/dd/yyyy"}
          </p>
        </div>
      </div>
    </button>
  );
};

export default PrivateMessagePreview;
