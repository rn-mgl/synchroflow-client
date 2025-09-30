"use client";

import React from "react";
import {
  AiFillPicture,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineRadarChart,
  AiOutlineUser,
} from "react-icons/ai";
import TextComp from "../input/TextComp";
import { useGlobalContext } from "@/base/context";
import { useSession } from "next-auth/react";
import useFile from "../hooks/useFile";
import TextAreaComp from "../input/TextAreaComp";
import axios from "axios";
import { useParams } from "next/navigation";
import { isSpecialCharacter } from "../utils/specialCharsUtils";

interface ProfileStateProps {
  name: string;
  surname: string;
  status: string;
  role: string;
  image: string | null;
  email: string;
  date_joined: string;
}

interface EditTaskProps {
  userData: ProfileStateProps;
  toggleCanEditUserData: () => void;
  getUserData: () => Promise<void>;
}

const EditUserData: React.FC<EditTaskProps> = (props) => {
  const [userData, setUserData] = React.useState<ProfileStateProps>({
    name: props.userData.name,
    surname: props.userData.surname,
    status: props.userData.status,
    role: props.userData.role,
    image: props.userData.image,
    email: props.userData.email,
    date_joined: props.userData.date_joined,
  });
  const { fileData, rawFile, removeRawFile, selectedFileViewer, uploadFile } =
    useFile();

  const url = process.env.API_URL;
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();

  const handleUserData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (isSpecialCharacter(value)) return;

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const removeUploadedFile = () => {
    setUserData((prev) => {
      return {
        ...prev,
        image: null,
      };
    });
  };

  const editUserData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let bannerURL = null;

    if (rawFile.current?.value) {
      bannerURL = await uploadFile(rawFile.current?.files);
      userData.image = bannerURL;
    }

    try {
      const { data } = await axios.patch(
        `${url}/users/${params?.user_uuid}`,
        { userData },
        {
          headers: { Authorization: user?.token },
          params: { type: "identifier" },
        }
      );

      if (data) {
        props.toggleCanEditUserData();
        await props.getUserData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
              bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
              flex flex-col items-center justify-start p-4 t:p-10"
    >
      <form
        onSubmit={(e) => editUserData(e)}
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4
                max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanEditUserData}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="flex flex-col w-64 items-center justify-center mx-auto">
          <div
            style={{
              backgroundImage: `url(${
                fileData.url ? fileData.url : userData.image
              })`,
            }}
            className="w-64 h-64 rounded-full flex flex-col items-center justify-center
                      border-2 border-primary-200 bg-center bg-cover "
          >
            {rawFile.current?.value || userData.image ? null : (
              <AiFillPicture className="text-primary-200 text-4xl" />
            )}
          </div>

          <div className="flex flex-row w-full items-center justify-between py-2">
            <p className="mt-auto text-sm opacity-50">Profile Image</p>

            <label className="cursor-pointer">
              <input
                ref={rawFile}
                type="file"
                formNoValidate
                accept="image/*"
                className="hidden peer"
                onChange={(e) => selectedFileViewer(e)}
              />
              {rawFile.current?.value || userData.image ? null : (
                <AiOutlinePlus className="text-primary-500 peer-checked animate-fadeIn" />
              )}
            </label>

            {rawFile.current?.value || userData.image ? (
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

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Name</p>
          <TextComp
            name="name"
            placeholder="Task Title..."
            required={true}
            value={userData.name}
            onChange={handleUserData}
            Icon={AiOutlineUser}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Surname</p>
          <TextComp
            name="surname"
            placeholder="Task Sub Title..."
            required={true}
            value={userData.surname}
            onChange={handleUserData}
            Icon={AiOutlineUser}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Role</p>
          <TextComp
            name="role"
            placeholder="Task Sub Title..."
            required={true}
            value={userData.role}
            onChange={handleUserData}
            Icon={AiOutlineRadarChart}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Status</p>
          <TextAreaComp
            name="status"
            placeholder="Task Sub Title..."
            required={true}
            value={userData.status}
            onChange={handleUserData}
            rows={5}
          />
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

export default EditUserData;
