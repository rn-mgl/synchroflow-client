import useLoader from "@/components/hooks/useLoading";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { RefObject } from "react";

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

interface MessageContextInterface {
  roomMessages: RoomMessagesStateProps[];
  messageRooms: MessageRoomsStateProps[];
  activeRoom: MessageRoomsStateProps;
  messageRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  selectedMessage: string;
  canCreateGroupMessage: boolean;
  messageType: "private" | "group";
  activePanelToolTip: boolean;
  canEditGroupMessage: boolean;
  canDeleteGroupMessage: boolean;
  canSeeGroupMembers: boolean;
  canAddGroupMembers: boolean;
  canLeaveGroup: boolean;
  getMessageRooms: (
    searchFilter: string,
    roomType: "private" | "group",
  ) => Promise<void>;
  getMessageRoomMessages: (
    roomType: "private" | "group",
    roomUUID: string,
  ) => Promise<void>;
  handleSelectedMessage: (messageUUID: string) => void;
  toggleCanCreateGroupMessage: () => void;
  getMessageRoom: (
    roomType: "private" | "group",
    roomUUID: string,
  ) => Promise<void>;
  handleMessageType: (type: "private" | "group") => void;
  clearActiveRoom: () => void;
  toggleActivePanelToolTip: () => void;
  toggleCanEditGroupMessage: () => void;
  toggleCanDeleteGroupMessage: () => void;
  toggleCanSeeGroupMembers: () => void;
  toggleCanAddGroupMembers: () => void;
  toggleCanLeaveGroup: () => void;
}

const MessageContext = React.createContext<MessageContextInterface | null>(
  null,
);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const messageRef = React.useRef<HTMLDivElement | null>(null); // used a separate use ref to clear div content after sending message

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const [messageRooms, setMessageRooms] = React.useState<
    Array<MessageRoomsStateProps>
  >([]);

  const [roomMessages, setRoomMessages] = React.useState<
    Array<RoomMessagesStateProps>
  >([]);

  const [canCreateGroupMessage, setCanCreateGroupMessage] =
    React.useState(false);

  const [selectedMessage, setSelectedMessage] = React.useState("");

  const [messageLimit, setMessageLimit] = React.useState(20);

  const { isLoading, handleLoader } = useLoader();

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

  const [messageType, setMessageType] = React.useState<"private" | "group">(
    "private",
  );

  const [activePanelToolTip, setActivePanelToolTip] = React.useState(false);

  const [canEditGroupMessage, setCanEditGroupMessage] = React.useState(false);

  const [canDeleteGroupMessage, setCanDeleteGroupMessage] =
    React.useState(false);

  const [canSeeGroupMembers, setCanSeeGroupMembers] = React.useState(false);

  const [canAddGroupMembers, setCanAddGroupMembers] = React.useState(false);

  const [canLeaveGroup, setCanLeaveGroup] = React.useState(false);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const handleSelectedMessage = React.useCallback((messageUUID: string) => {
    setSelectedMessage((prev) => (prev === messageUUID ? "" : messageUUID));
  }, []);

  const toggleCanCreateGroupMessage = React.useCallback(() => {
    setCanCreateGroupMessage((prev) => !prev);
  }, []);

  const handleMessageType = (type: "private" | "group") => {
    if (type !== messageType) {
      setMessageRooms([]);
    }

    setMessageType(type);
  };

  const clearActiveRoom = () => {
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
  };

  const toggleActivePanelToolTip = () => {
    setActivePanelToolTip((prev) => !prev);
  };

  const toggleCanEditGroupMessage = () => {
    setCanEditGroupMessage((prev) => !prev);
  };

  const toggleCanDeleteGroupMessage = () => {
    setCanDeleteGroupMessage((prev) => !prev);
  };

  const toggleCanSeeGroupMembers = () => {
    setCanSeeGroupMembers((prev) => !prev);
  };

  const toggleCanAddGroupMembers = () => {
    setCanAddGroupMembers((prev) => !prev);
  };

  const toggleCanLeaveGroup = () => {
    setCanLeaveGroup((prev) => !prev);
  };

  const getMessageRooms = React.useCallback(
    async (searchFilter: string, roomType: "private" | "group") => {
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
    [url, user?.token],
  );

  const getMessageRoomMessages = React.useCallback(
    async (roomType: "private" | "group", roomUUID: string) => {
      if (user?.token && !isLoading) {
        handleLoader(true);
        try {
          const { data } = await axios.get(
            `${url}/${roomType}_message_rooms/${roomUUID}`,
            {
              headers: { Authorization: user?.token },
              params: {
                type: "messages",
                limit: messageLimit,
              },
            },
          );

          if (data) {
            if (data.length !== roomMessages.length) {
              setMessageLimit((prev) => prev + 20);
            }

            setRoomMessages(data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          handleLoader(false);
        }
      }
    },
    [
      url,
      user?.token,
      messageLimit,
      handleLoader,
      isLoading,
      roomMessages.length,
    ],
  );

  const getMessageRoom = React.useCallback(
    async (roomType: "private" | "group", roomUUID: string) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(
            `${url}/${roomType}_message_rooms/${roomUUID}`,
            {
              headers: { Authorization: user?.token },
              params: { type: "main" },
            },
          );
          if (data) {
            setActiveRoom(data);
            setMessageLimit(20);
            await getMessageRoomMessages(roomType, roomUUID);
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ top: 0 });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user?.token, getMessageRoomMessages],
  );

  React.useEffect(() => {
    const messagesContainer = scrollRef.current;

    if (!messagesContainer) return;

    const handleScroll = () => {
      if (
        Math.floor(
          messagesContainer.scrollTop +
            messagesContainer.scrollHeight -
            messagesContainer.clientHeight,
        ) <= 5
      ) {
        getMessageRoomMessages(messageType, activeRoom.message_room);
      }
    };

    messagesContainer.addEventListener("scroll", handleScroll);

    return () => {
      messagesContainer.removeEventListener("scroll", handleScroll);
    };
  }, [messageType, activeRoom.message_room, getMessageRoomMessages]);

  return (
    <MessageContext.Provider
      value={{
        roomMessages,
        messageRooms,
        activeRoom,
        messageRef,
        scrollRef,
        selectedMessage,
        canCreateGroupMessage,
        messageType,
        activePanelToolTip,
        canEditGroupMessage,
        canDeleteGroupMessage,
        canSeeGroupMembers,
        canAddGroupMembers,
        canLeaveGroup,
        getMessageRooms,
        getMessageRoomMessages,
        handleSelectedMessage,
        toggleCanCreateGroupMessage,
        getMessageRoom,
        handleMessageType,
        clearActiveRoom,
        toggleActivePanelToolTip,
        toggleCanEditGroupMessage,
        toggleCanDeleteGroupMessage,
        toggleCanSeeGroupMembers,
        toggleCanAddGroupMembers,
        toggleCanLeaveGroup,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export { MessageContext, MessageProvider };

export const useMessageContext = () => {
  const messageContext = React.useContext(MessageContext);

  if (!messageContext) {
    throw new Error(`No context generated for message.`);
  }

  return messageContext;
};
