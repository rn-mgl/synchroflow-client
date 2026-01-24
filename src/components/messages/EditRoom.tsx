"use client";
import { useGlobalContext } from "@/base/src/contexts/context";
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
import useFile from "../../hooks/useFile";
import { MessageRoomsStateProps } from "../../contexts/messageContext";
import TextComp from "../input/TextComp";

interface EditRoomProps {
  toggleCanEditRoom: () => void;
  getAllMessageRooms: () => Promise<void>;
  roomData: MessageRoomsStateProps;
  getRoom: () => Promise<void>;
}

interface RoomStateProps {
  roomName: string;
  roomImage: string | null;
}

const EditRoom: React.FC<EditRoomProps> = (props) => {
  const [roomData, setRoomData] = React.useState<RoomStateProps>({
    roomName: props.roomData.room_name,
    roomImage: props.roomData.room_image,
  });
  const { fileData, rawFile, removeRawFile, selectedFileViewer, uploadFile } =
    useFile();

  const { socket } = useGlobalContext();
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const handleRoomData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setRoomData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const removeUploadedFile = () => {
    setRoomData((prev) => {
      return {
        ...prev,
        roomImage: null,
      };
    });
  };

  const editRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let roomImage = null;

      if (rawFile.current?.value) {
        roomImage = await uploadFile(rawFile.current.files);
        roomData.roomImage = roomImage;
      }

      const { data } = await axios.patch(
        `${url}/message_rooms/${props.roomData.message_room}`,
        { roomData, roomType: "group" },
        { headers: { Authorization: user?.token }, params: { type: "name" } },
      );

      if (data.updatedRoom) {
        await props.getRoom();
        await props.getAllMessageRooms();
        props.toggleCanEditRoom();
        socket?.emit("update_room_room", { rooms: data.rooms });
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
        onSubmit={(e) => editRoom(e)}
        className="w-full bg-white h-fit rounded-lg flex flex-col p-4 t:p-10 gap-4 my-auto
                  max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanEditRoom}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Title</p>
          <TextComp
            name="roomName"
            placeholder="Room Name..."
            required={true}
            value={roomData.roomName}
            onChange={handleRoomData}
            Icon={MdTitle}
          />
        </div>

        <div className="flex flex-col w-full items-center justify-center">
          <div
            style={{
              backgroundImage: `url(${
                fileData.url ? fileData.url : roomData.roomImage
              })`,
            }}
            className="w-full h-40 rounded-xl flex flex-col items-center justify-center
                      border-2 border-primary-200 bg-center bg-cover"
          >
            {rawFile.current?.value || roomData.roomImage ? null : (
              <AiFillPicture className="text-primary-200 text-4xl" />
            )}
          </div>

          <div className="flex flex-row w-full items-center justify-between py-2">
            <p className="mt-auto text-sm opacity-50">Room Image</p>

            <label className="cursor-pointer">
              <input
                ref={rawFile}
                type="file"
                formNoValidate
                accept="image/*"
                className="hidden peer"
                onChange={(e) => selectedFileViewer(e)}
              />
              {rawFile.current?.value || roomData.roomImage ? null : (
                <AiOutlinePlus className="text-primary-500 peer-checked animate-fadeIn" />
              )}
            </label>

            {rawFile.current?.value || roomData.roomImage ? (
              <button
                type="button"
                className="animate-fadeIn"
                onClick={
                  rawFile.current?.value ? removeRawFile : removeUploadedFile
                }
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
          Update
        </button>
      </form>
    </div>
  );
};

export default EditRoom;
