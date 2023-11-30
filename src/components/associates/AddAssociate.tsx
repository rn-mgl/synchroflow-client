"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlineClose, AiOutlineSearch, AiOutlineTool } from "react-icons/ai";
import AssociateCardsInvite from "./AssociateCardsInvite";
import useMessage from "../hooks/useMessage";
import Message from "../global/Message";
import SearchFilter from "../filter/SearchFilter";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsFilter } from "react-icons/bs";

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
  const [searchInput, setSearchInput] = React.useState("");
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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchInput(value);
  };

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

        <div className="bg-white w-full p-4 flex flex-col gap-4 rounded-lg h-fit">
          <p className="font-semibold text-xl">Explore Potential Associates</p>

          <div className="flex flex-row justify-center h-full w-full">
            <div className="flex flex-row gap-4 h-fit w-full">
              <div className="max-w-screen-m-m w-full mr-auto h-fit">
                <SearchFilter
                  placeholder="Search Associates"
                  name="searchInput"
                  onChange={handleSearchInput}
                  required={false}
                  value={searchInput}
                  Icon={AiOutlineSearch}
                />
              </div>

              <button
                className="p-2 rounded-lg border-[1px] w-16 flex flex-col items-center justify-center
                        t:hidden"
              >
                <AiOutlineTool className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
              </button>

              <button
                className="hidden p-2 rounded-lg border-[1px] flex-row gap-2
                        items-center justify-between t:flex font-medium px-6"
              >
                <div>
                  <LuLayoutDashboard className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                </div>
                <p className="text-xs">Category</p>
              </button>

              <button
                className="hidden p-2 rounded-lg border-[1px] flex-row gap-2
                        items-center justify-between t:flex font-medium px-6"
              >
                <div>
                  <BsFilter className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
                </div>
                <p className="text-xs">Sort by: {`Deadline`}</p>
              </button>
            </div>
          </div>
        </div>

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
