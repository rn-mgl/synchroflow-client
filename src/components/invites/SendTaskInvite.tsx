"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { AiFillCheckCircle, AiFillStar, AiOutlineClose, AiOutlineFileText, AiOutlineUser } from "react-icons/ai";
import SearchFilter from "../filter/SearchFilter";
import Loading from "../global/Loading";
import Message from "../global/Message";
import useLoader from "../hooks/useLoading";
import useNotification from "../hooks/useNotification";
import TextAreaComp from "../input/TextAreaComp";

interface SendTaskInviteProps {
  taskUUID: string;
  toggleCanInvite: () => void;
}

interface AssociatesStateProps {
  name: string;
  surname: string;
  user_uuid: string;
}

const SendTaskInvite: React.FC<SendTaskInviteProps> = (props) => {
  const [inviteMessage, setInviteMessage] = React.useState("");
  const [associates, setAssociates] = React.useState<Array<AssociatesStateProps>>([
    { name: "", surname: "", user_uuid: "" },
  ]);
  const [associatesToInvite, setAssociatesToInvite] = React.useState<string[]>([]);
  const [searchFilter, setSearchFilter] = React.useState({ searchKey: "name", toSearch: "" });

  const { isLoading, handleLoader } = useLoader();
  const { message, handleMessages } = useNotification();

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();

  const handleInviteMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setInviteMessage(value);
  };

  const handleAssociateToInvite = (associateUUID: string) => {
    setAssociatesToInvite((prev) =>
      prev.includes(associateUUID) ? prev.filter((associate) => associate !== associateUUID) : [...prev, associateUUID]
    );
  };

  const handleSeachFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setSearchFilter((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getAssociates = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_task_invites`, {
          headers: { Authorization: user?.token },
          params: { type: "invite associates", mainTaskUUID: params?.task_uuid },
        });

        if (data) {
          setAssociates(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, params?.task_uuid]);

  const mappedAssociates = associates.map((associate, index) => {
    return (
      <button
        type="button"
        onClick={() => handleAssociateToInvite(associate.user_uuid)}
        key={index}
        className="flex flex-row gap-4 justify-center min-w-[16rem] w-80 h-full select-none relative"
      >
        {associatesToInvite.includes(associate.user_uuid) ? (
          <div className="absolute top-0 right-0 animate-fadeIn">
            <AiFillCheckCircle className="text-lg text-primary-500" />
          </div>
        ) : null}

        <div className="bg-neutral-50 w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md overflow-y-auto">
          <div className="flex flex-row gap-1 items-center justify-center">
            <div className="bg-primary-100 w-12 min-w-[3rem] h-12 min-h-[3rem] rounded-full mr-auto" />
            <div className="flex flex-col gap-1 items-end">
              <p className="font-bold truncate max-w-[15ch]">
                {associate.name} {associate.surname}
              </p>
              <p className="text-xs max-w-[20ch] truncate">template role</p>
            </div>
          </div>

          <p className="text-xs my-auto text-justify leading-relaxed indent-10">
            Follow the video tutorial above. Understand how to use each tool in the Figma application. Also learn how to
            make a good and correct design.
          </p>

          <div className="flex flex-row justify-between items-center mt-4">
            <div className="flex flex-row gap-1 items-center justify-center text-xs">
              <div>
                <AiOutlineFileText className="text-sm" />
              </div>
              <p>template deadline</p>
            </div>

            <div className="flex flex-row gap-1 items-center justify-center relative text-xs">
              <div>
                <AiFillStar className="text-warning-500 text-sm" />
              </div>
              <p>4.5 (750 Reviews)</p>
            </div>
          </div>
        </div>
      </button>
    );
  });

  const sendInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);

    if (associatesToInvite.length < 1) {
      handleLoader(false);
      handleMessages(true, "Please select an associate before sending an invite.", "error");
      return;
    }

    try {
      e.preventDefault();

      const { data } = await axios.post(
        `${url}/main_task_invites`,
        { associatesToInvite, inviteMessage, taskUUID: props.taskUUID },
        { headers: { Authorization: user?.token } }
      );

      if (data) {
        handleMessages(true, "Invite sent successfully", "info");
        handleLoader(false);
        props.toggleCanInvite();
      }
    } catch (error) {
      handleLoader(false);
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAssociates();
  }, [getAssociates]);

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
            bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
            flex flex-col items-center justify-start p-4 t:p-10"
    >
      {message.active ? <Message message={message} handleMessages={handleMessages} /> : null}
      {isLoading ? <Loading /> : null}

      <form
        onSubmit={(e) => sendInvite(e)}
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4
              max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanInvite}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Associates</p>
          <SearchFilter
            Icon={AiOutlineUser}
            name="toSearch"
            placeholder="Search Name..."
            onChange={handleSeachFilter}
            required={false}
            value={searchFilter.toSearch}
          />
          <div
            className="w-full flex flex-row justify-start items-center overflow-x-auto 
                    cstm-scrollbar gap-4"
          >
            {mappedAssociates}
          </div>
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Invite Message</p>
          <TextAreaComp
            name="inviteMessage"
            placeholder="Invite Message..."
            required={false}
            rows={7}
            value={inviteMessage}
            onChange={handleInviteMessage}
          />
        </div>

        <button
          type="submit"
          className="bg-primary-500 rounded-lg text-white 
                font-bold p-2 w-full mt-auto"
        >
          Invite
        </button>
      </form>
    </div>
  );
};

export default SendTaskInvite;
