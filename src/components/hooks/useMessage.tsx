import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

export interface MessageRoomsStateProps {
  image: string;
  name: string;
  surname: string;
  message_room: string;
  message: string;
  message_file: string;
  message_from: number;
  user_uuid: string;
  date_sent: string;
  created_by: number;
  room_image: string;
  room_name: string;
}

export interface RoomMessagesStateProps {
  image: string;
  name: string;
  surname: string;
  date_sent: string;
  message: string;
  message_file: string | null;
  message_file_type: string | null;
  message_from: number;
  message_uuid: string;
}

export default function useMessage() {
  const [selectedMessageRoom, setSelectedMessageRoom] = React.useState("");
  const [roomType, setRoomType] = React.useState<"private" | "group">("private");

  const messageRef = React.useRef<HTMLDivElement>(null); // used a separate use ref to clear div content after sending message

  const [messageRooms, setMessageRooms] = React.useState<Array<MessageRoomsStateProps>>([]);
  const [roomMessages, setRoomMessages] = React.useState<Array<RoomMessagesStateProps>>([]);
  const [canCreateGroupMessage, setCanCreateGroupMessage] = React.useState(false);

  const [selectedMessage, setSelectedMessage] = React.useState("");
  const [activeRoom, setActiveRoom] = React.useState<MessageRoomsStateProps>({
    image: "",
    name: "",
    surname: "",
    message_room: "",
    message: "",
    message_file: "",
    message_from: -1,
    user_uuid: "",
    date_sent: "",
    created_by: -1,
    room_image: "",
    room_name: "",
  });

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const handleSelectedMessage = React.useCallback((messageUUID: string) => {
    setSelectedMessage((prev) => (prev === messageUUID ? "" : messageUUID));
  }, []);

  const handleSelectedRoomType = React.useCallback((roomType: "private" | "group") => {
    setRoomType(roomType);
    setSelectedMessageRoom("");
    setActiveRoom({
      image: "",
      name: "",
      surname: "",
      message_room: "",
      message: "",
      message_file: "",
      message_from: -1,
      user_uuid: "",
      date_sent: "",
      created_by: -1,
      room_image: "",
      room_name: "",
    });
  }, []);

  const toggleCanCreateGroupMessage = React.useCallback(() => {
    setCanCreateGroupMessage((prev) => !prev);
  }, []);

  const getMessageRooms = React.useCallback(
    async (searchFilter: string) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/${roomType}_message_rooms`, {
            headers: { Authorization: user?.token },
            params: { searchFilter },
          });
          if (data) {
            setMessageRooms(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user?.token, roomType]
  );

  const getMessageRoomMessages = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/${roomType}_message_rooms/${selectedMessageRoom}`, {
          headers: { Authorization: user?.token },
          params: { type: "messages" },
        });
        if (data) {
          setRoomMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, selectedMessageRoom, roomType]);

  const getMessageRoom = React.useCallback(async () => {
    if (user?.token && selectedMessageRoom) {
      try {
        const { data } = await axios.get(`${url}/${roomType}_message_rooms/${selectedMessageRoom}`, {
          headers: { Authorization: user?.token },
          params: { type: "main" },
        });
        if (data) {
          setActiveRoom(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, roomType, selectedMessageRoom]);

  const handleSelectedMessageRoom = React.useCallback((messageUUID: string, type: "back" | "preview") => {
    setSelectedMessageRoom((prev) => (prev === messageUUID && type === "back" ? "" : messageUUID));
  }, []);

  return {
    selectedMessageRoom,
    roomMessages,
    messageRooms,
    activeRoom,
    messageRef,
    selectedMessage,
    roomType,
    canCreateGroupMessage,
    getMessageRooms,
    getMessageRoomMessages,
    handleSelectedMessageRoom,
    handleSelectedMessage,
    handleSelectedRoomType,
    toggleCanCreateGroupMessage,
    getMessageRoom,
  };
}
