import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

export interface MessageRoomsStateProps {
  image: string;
  name: string;
  surname: string;
  private_message_room: string;
  private_message: string;
  private_message_file: string;
  private_message_from: number;
  user_uuid: string;
}

export interface RoomMessagesStateProps {
  image: string;
  name: string;
  surname: string;
  date_sent: string;
  private_message: string;
  private_message_file: string | null;
  private_message_file_type: string | null;
  private_message_from: number;
  private_message_uuid: string;
}

export default function useMessage() {
  const [selectedMessageRoom, setSelectedMessageRoom] = React.useState("");
  const [message, setMessage] = React.useState(""); // used a separate use state for message to have realtime update on div content
  const messageRef = React.useRef<HTMLDivElement>(null); // used a separate use ref to clear div content after sending message
  const [roomMessages, setRoomMessages] = React.useState<Array<RoomMessagesStateProps>>([]);
  const [privateMessageRooms, setPrivateMessageRooms] = React.useState<Array<MessageRoomsStateProps>>([]);
  const [selectedMessage, setSelectedMessage] = React.useState("");
  const [activeRoom, setActiveRoom] = React.useState<MessageRoomsStateProps>({
    image: "",
    name: "",
    surname: "",
    private_message_room: "",
    private_message: "",
    private_message_file: "",
    private_message_from: -1,
    user_uuid: "",
  });

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getPrivateMessageRooms = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/private_message_rooms`, { headers: { Authorization: user?.token } });
        if (data) {
          setPrivateMessageRooms(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const getMessageRoom = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/private_message_rooms/${selectedMessageRoom}`, {
          headers: { Authorization: user?.token },
        });
        if (data) {
          setRoomMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, selectedMessageRoom]);

  const setSelectedMessageRoomData = React.useCallback((messageUUID: string, type: "back" | "preview") => {
    setSelectedMessageRoom((prev) => (prev === messageUUID && type === "back" ? "" : messageUUID));
  }, []);

  const setMessageData = React.useCallback((message: string) => {
    setMessage(message);
  }, []);

  const setSelectedMessageData = React.useCallback((messageUUID: string) => {
    setSelectedMessage((prev) => (prev === messageUUID ? "" : messageUUID));
  }, []);

  const setActiveRoomData = React.useCallback(
    (roomData: {
      image: string;
      name: string;
      surname: string;
      private_message_room: string;
      private_message: string;
      private_message_file: string;
      private_message_from: number;
      user_uuid: string;
    }) => {
      setActiveRoom(roomData);
    },
    []
  );

  return {
    selectedMessageRoom,
    message,
    roomMessages,
    privateMessageRooms,
    activeRoom,
    messageRef,
    selectedMessage,
    getPrivateMessageRooms,
    getMessageRoom,
    setMessageData,
    setSelectedMessageRoomData,
    setSelectedMessageData,
    setActiveRoomData,
  };
}
