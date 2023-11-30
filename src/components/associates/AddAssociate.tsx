"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import AssociateCardsInvite from "./AssociateCardsInvite";
import useMessage from "../hooks/useMessage";
import Message from "../global/Message";

interface AddAssociateProps {
  toggleCanAddAssociate: () => void;
}

interface AssociateStateProps {
  name: string;
  surname: string;
  user_uuid: string;
  image: string;
  email: string;
  status: string;
  role: string;
  associate_invite_uuid: string;
  is_invited: boolean;
}

const AddAssociate: React.FC<AddAssociateProps> = (props) => {
  const [users, setUsers] = React.useState<Array<AssociateStateProps>>([
    {
      name: "",
      surname: "",
      user_uuid: "",
      image: "",
      email: "",
      status: "",
      role: "",
      associate_invite_uuid: "",
      is_invited: false,
    },
  ]);
  const { message, handleMessages } = useMessage();

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getUsers = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/users`, { headers: { Authorization: user?.token } });
        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const sendInvite = async (inviteTo: string) => {
    try {
      const { data } = await axios.post(
        `${url}/associate_invites`,
        { inviteTo },
        { headers: { Authorization: user?.token } }
      );
      if (data) {
        await getUsers();
        handleMessages(true, "Invite sent successfully", "info");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelRequest = async (inviteUUID: string) => {
    try {
      const { data } = await axios.delete(
        `${url}/associate_invites/${inviteUUID}`,

        { headers: { Authorization: user?.token } }
      );
      if (data) {
        await getUsers();
        handleMessages(true, "Invite removed successfully", "info");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedUsers = users.map((user, index) => {
    return (
      <AssociateCardsInvite
        key={index}
        name={user.name}
        surname={user.surname}
        email={user.email}
        image={user.image}
        status={user.status}
        role={user.role}
        user_uuid={user.user_uuid}
        associate_invite_uuid={user.associate_invite_uuid}
        sendInvite={() => sendInvite(user.user_uuid)}
        cancelRequest={() => cancelRequest(user.associate_invite_uuid)}
      />
    );
  });

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
                bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
                flex flex-col items-center justify-start p-4 t:p-10"
    >
      {message.active ? <Message message={message} handleMessages={handleMessages} /> : null}
      <div
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4
          max-w-screen-t items-center justify-start"
      >
        <button
          onClick={props.toggleCanAddAssociate}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div
          className="w-full grid grid-cols-1 t:grid-cols-2 gap-4 overflow-y-auto 
                    cstm-scrollbar items-start"
        >
          {mappedUsers}
        </div>
      </div>
    </div>
  );
};

export default AddAssociate;
