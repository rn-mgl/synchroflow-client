"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import {
  AiFillPicture,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlinePlus,
} from "react-icons/ai";
import { MdTitle } from "react-icons/md";
import useFile from "../hooks/useFile";
import TextComp from "../input/TextComp";

interface CreateGroupMessageProps {
  toggleCanCreateGroupMessage: () => void;
  getMessageRooms: () => Promise<void>;
}

interface GroupMessageStateProps {
  groupMessageName: string;
  groupImage: string | null;
}

const CreateGroupMessage: React.FC<CreateGroupMessageProps> = (props) => {
  const [groupMessageData, setGroupMessageData] =
    React.useState<GroupMessageStateProps>({
      groupMessageName: "",
      groupImage: "",
    });
  const { fileData, rawFile, removeRawFile, selectedFileViewer, uploadFile } =
    useFile();

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession();
  const user = session?.user;

  const handleGroupMessageData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setGroupMessageData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let groupImage = null;

      if (rawFile.current?.value) {
        groupImage = await uploadFile(rawFile.current.files);
      }

      groupMessageData.groupImage = groupImage;

      const { data } = await axios.post(
        `${url}/group_message_rooms`,
        { groupMessageData },
        { headers: { Authorization: user?.token } }
      );
      if (data) {
        props.toggleCanCreateGroupMessage();
        await props.getMessageRooms();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-30 animate-fadeIn
        bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
        flex flex-col items-center justify-start p-4 t:p-10"
    >
      <form
        onSubmit={(e) => createGroup(e)}
        className="w-full bg-white h-fit rounded-lg flex flex-col p-4 t:p-10 gap-4 my-auto
                  max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanCreateGroupMessage}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Title</p>
          <TextComp
            name="groupMessageName"
            placeholder="Group Name..."
            required={true}
            value={groupMessageData.groupMessageName}
            onChange={handleGroupMessageData}
            Icon={MdTitle}
          />
        </div>

        <div className="flex flex-col w-full items-center justify-center">
          <div
            style={{ backgroundImage: `url(${fileData.url})` }}
            className="w-full h-40 rounded-xl flex flex-col items-center justify-center
                      border-2 border-primary-200 bg-center bg-cover"
          >
            {rawFile.current?.value ? null : (
              <AiFillPicture className="text-primary-200 text-4xl" />
            )}
          </div>

          <div className="flex flex-row w-full items-center justify-between py-2">
            <p className="mt-auto text-sm opacity-50">Group Image</p>

            <label className="cursor-pointer">
              <input
                ref={rawFile}
                type="file"
                formNoValidate
                accept="image/*"
                className="hidden peer"
                onChange={(e) => selectedFileViewer(e)}
              />
              {rawFile.current?.value ? null : (
                <AiOutlinePlus className="text-primary-500 peer-checked animate-fadeIn" />
              )}
            </label>

            {rawFile.current?.value ? (
              <button
                type="button"
                className="animate-fadeIn"
                onClick={removeRawFile}
              >
                <AiOutlineDelete className="text-primary-500" />
              </button>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary-500 rounded-lg text-white 
                    font-bold p-2 w-full"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateGroupMessage;
