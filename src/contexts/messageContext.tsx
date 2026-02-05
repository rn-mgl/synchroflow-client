import useLoader from "@/src/hooks/useLoading";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { RefObject } from "react";

export interface MessageRoomsStateProps {
  message_room_id: number;
  message_room: string;
  room_image: string;
  room_name: string;
  created_by: number;
}

export interface RoomMessagesStateProps {
  image: string;
  name: string;
  surname: string;
  date_sent: string;
  message: string;
  message_file: string | null;
  message_file_type: string | null;
  sender: number;
  message_uuid: string;
}

interface MessageContextInterface {
  roomMessages: RoomMessagesStateProps[];
  messageRooms: MessageRoomsStateProps[];
  activeRoom: MessageRoomsStateProps;
  messageRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  selectedMessage: string;
  canCreateRoom: boolean;
  roomType: "private" | "group";
  activePanelToolTip: boolean;
  canEditRoom: boolean;
  canDeleteRoom: boolean;
  canSeeRoomMembers: boolean;
  canAddRoomMember: boolean;
  canLeaveGroup: boolean;
  getAllMessageRooms: (roomType: "private" | "group") => Promise<void>;
  getRoomMessages: (
    roomType: "private" | "group",
    roomUUID: string,
  ) => Promise<void>;
  handleSelectedMessage: (messageUUID: string) => void;
  toggleCanCreateRoom: () => void;
  getRoom: (roomType: "private" | "group", roomUUID: string) => Promise<void>;
  handleRoomType: (type: "private" | "group") => void;
  clearActiveRoom: () => void;
  toggleActivePanelToolTip: () => void;
  toggleCanEditRoom: () => void;
  toggleCanDeleteRoom: () => void;
  toggleCanSeeRoomMembers: () => void;
  toggleCanAddRoomMember: () => void;
  toggleCanLeaveGroup: () => void;
}

const MessageContext = React.createContext<MessageContextInterface | null>(
  null,
);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const messageRef = React.useRef<HTMLDivElement | null>(null); // used a separate use ref to clear div content after sending message

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const [messageRooms, setMessageRooms] = React.useState<
    MessageRoomsStateProps[]
  >([]);

  const [roomMessages, setRoomMessages] = React.useState<
    RoomMessagesStateProps[]
  >([]);

  const [canCreateRoom, setCanCreateRoom] = React.useState(false);

  const [selectedMessage, setSelectedMessage] = React.useState("");

  const [messageLimit, setMessageLimit] = React.useState(20);

  const { isLoading, handleLoader } = useLoader();

  const [activeRoom, setActiveRoom] = React.useState<MessageRoomsStateProps>({
    message_room: "",
    created_by: 0,
    room_image: "",
    room_name: "",
    message_room_id: 0,
  });

  const [roomType, setRoomType] = React.useState<"private" | "group">(
    "private",
  );

  const [activePanelToolTip, setActivePanelToolTip] = React.useState(false);

  const [canEditRoom, setCanEditRoom] = React.useState(false);

  const [canDeleteRoom, setCanDeleteRoom] = React.useState(false);

  const [canSeeRoomMembers, setCanSeeRoomMembers] = React.useState(false);

  const [canAddRoomMember, setCanAddRoomMember] = React.useState(false);

  const [canLeaveGroup, setCanLeaveGroup] = React.useState(false);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const handleSelectedMessage = React.useCallback((messageUUID: string) => {
    setSelectedMessage((prev) => (prev === messageUUID ? "" : messageUUID));
  }, []);

  const toggleCanCreateRoom = React.useCallback(() => {
    setCanCreateRoom((prev) => !prev);
  }, []);

  const handleRoomType = (type: "private" | "group") => {
    if (type === roomType) return;

    setMessageRooms([]);
    setRoomType(type);
    clearActiveRoom();
  };

  const clearActiveRoom = () => {
    setActiveRoom({
      message_room: "",
      created_by: 0,
      room_image: "",
      room_name: "",
      message_room_id: 0,
    });
  };

  const toggleActivePanelToolTip = () => {
    setActivePanelToolTip((prev) => !prev);
  };

  const toggleCanEditRoom = () => {
    setCanEditRoom((prev) => !prev);
  };

  const toggleCanDeleteRoom = () => {
    setCanDeleteRoom((prev) => !prev);
  };

  const toggleCanSeeRoomMembers = () => {
    setCanSeeRoomMembers((prev) => !prev);
  };

  const toggleCanAddRoomMember = () => {
    setCanAddRoomMember((prev) => !prev);
  };

  const toggleCanLeaveGroup = () => {
    setCanLeaveGroup((prev) => !prev);
  };

  const getAllMessageRooms = React.useCallback(
    async (roomType: "private" | "group") => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/message_rooms`, {
            headers: { Authorization: user?.token },
            params: { roomType },
          });
          if (data) {
            setMessageRooms(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user],
  );

  const getRoomMessages = React.useCallback(
    async (roomType: "private" | "group", roomUUID: string) => {
      if (user?.token && !isLoading) {
        handleLoader(true);
        try {
          const { data } = await axios.get(`${url}/message_rooms/${roomUUID}`, {
            headers: { Authorization: user?.token },
            params: {
              type: "messages",
              limit: messageLimit,
              roomType,
            },
          });

          if (data) {
            setMessageLimit((prev) => prev + 20);
            setRoomMessages(data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          handleLoader(false);
        }
      }
    },
    [url, user, messageLimit, handleLoader, isLoading],
  );

  const getRoom = React.useCallback(
    async (roomType: "private" | "group", roomUUID: string) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/message_rooms/${roomUUID}`, {
            headers: { Authorization: user?.token },
            params: { type: "main", roomType },
          });
          if (data) {
            setActiveRoom(data);
            setMessageLimit(20);
            await getRoomMessages(roomType, roomUUID);
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ top: 0 });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user, getRoomMessages],
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
        getRoomMessages(roomType, activeRoom.message_room);
      }
    };

    messagesContainer.addEventListener("scroll", handleScroll);

    return () => {
      messagesContainer.removeEventListener("scroll", handleScroll);
    };
  }, [roomType, activeRoom.message_room, getRoomMessages]);

  return (
    <MessageContext.Provider
      value={{
        roomMessages,
        messageRooms,
        activeRoom,
        messageRef,
        scrollRef,
        selectedMessage,
        canCreateRoom,
        roomType,
        activePanelToolTip,
        canEditRoom,
        canDeleteRoom,
        canSeeRoomMembers,
        canAddRoomMember,
        canLeaveGroup,
        getAllMessageRooms,
        getRoomMessages,
        handleSelectedMessage,
        toggleCanCreateRoom,
        getRoom,
        handleRoomType,
        clearActiveRoom,
        toggleActivePanelToolTip,
        toggleCanEditRoom,
        toggleCanDeleteRoom,
        toggleCanSeeRoomMembers,
        toggleCanAddRoomMember,
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
