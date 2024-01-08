"use client";

import { useGlobalContext } from "@/base/context";
import useDashboard from "@/components//hooks/useDashboard";
import ChangePassword from "@/components//users/ChangePassword";
import EditUserData from "@/components//users/EditUserData";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from "react-icons/bi";

interface ProfileStateProps {
  name: string;
  surname: string;
  status: string;
  role: string;
  image: string | null;
  email: string;
  date_joined: string;
}

const Profile = () => {
  const [userData, setUserData] = React.useState<ProfileStateProps>({
    name: "",
    surname: "",
    status: "",
    role: "",
    image: null,
    email: "",
    date_joined: "",
  });
  const [password, setPassword] = React.useState({
    currentPassword: "",
    newPassword: "",
    retypedNewPassword: "",
  });
  const [canEditUserData, setCanEditUserData] = React.useState(false);
  const [canChangePassword, setCanChangePassword] = React.useState(false);

  const { tasksCount, getTasksCount } = useDashboard();
  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();

  const toggleCanEditUserData = () => {
    setCanEditUserData((prev) => !prev);
  };

  const toggleCanChangePassword = () => {
    setCanChangePassword((prev) => !prev);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPassword((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getUserData = React.useCallback(async () => {
    if (user?.token && params?.user_uuid) {
      try {
        const { data } = await axios.get(`${url}/users/${params?.user_uuid}`, {
          headers: { Authorization: user?.token },
        });

        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, params?.user_uuid]);

  React.useEffect(() => {
    getUserData();
  }, [getUserData]);

  React.useEffect(() => {
    getTasksCount();
  }, [getTasksCount]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
                items-center w-full h-full"
      >
        {canEditUserData ? (
          <EditUserData userData={userData} getUserData={getUserData} toggleCanEditUserData={toggleCanEditUserData} />
        ) : null}

        {canChangePassword ? (
          <ChangePassword getUserData={getUserData} toggleCanChangePassword={toggleCanChangePassword} />
        ) : null}
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="flex flex-col w-full items-center justify-start gap-4 h-full l-s:flex-row">
            <div
              className="flex flex-col items-center justify-between w-full rounded-lg
                    bg-primary-500 min-h-[14rem] h-full p-4 gap-4"
            >
              <div className="flex flex-row w-full gap-2 items-start justify-between ">
                <div
                  style={{ backgroundImage: `url(${userData.image})` }}
                  className="w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] bg-primary-100 
                      rounded-full t:min-w-[4.5rem] t:min-h-[4.5rem] bg-center bg-cover bg-no-repeat"
                />

                <div className="flex flex-col w-full text-white mr-auto">
                  <p className="font-bold text-lg max-w-[12ch] truncate t:max-w-[30ch] t:text-2xl">
                    {userData.name} {userData.surname}
                  </p>
                  <p className="font-light text-sm">{userData.role}</p>
                </div>

                <button
                  onClick={toggleCanEditUserData}
                  className="p-2 rounded-full hover:bg-primary-700  transition-all"
                >
                  <AiOutlineEdit className="text-white" />
                </button>
              </div>

              <div className="w-full flex flex-row items-center justify-around">
                <p className="flex flex-col items-center justify-center text-white">
                  <span className="text-lg font-extrabold t:text-2xl">
                    {tasksCount.ongoingMainTasksCount + tasksCount.ongoingSubTasksCount}
                  </span>
                  <span className="text-xs ">Ongoing Tasks</span>
                </p>

                <div className="w-[1px] h-10 bg-white" />

                <p className="flex flex-col items-center justify-center text-white">
                  <span className="text-lg font-extrabold t:text-2xl">
                    {tasksCount.doneMainTasksCount + tasksCount.doneSubTasksCount}
                  </span>
                  <span className="text-xs ">Done Tasks</span>
                </p>

                <div className="w-[1px] h-10 bg-white" />

                <p className="flex flex-col items-center justify-center text-white">
                  <span className="text-lg font-extrabold t:text-2xl">
                    {tasksCount.lateMainTasksCount + tasksCount.lateSubTasksCount}
                  </span>
                  <span className="text-xs ">Late Tasks</span>
                </p>
              </div>

              <button onClick={toggleCanChangePassword} className="text-xs text-white hover:underline">
                change password
              </button>
            </div>

            <div
              className="flex flex-col items-center justify-center w-full rounded-lg 
                    bg-white min-h-[14rem] h-full p-4 gap-2"
            >
              <div className="mr-auto h-full">
                <BiSolidQuoteAltLeft className="text-primary-500 text-2xl" />
              </div>
              <p className="text-sm max-w-xl whitespace-pre text-center">{userData?.status}</p>
              <div className="ml-auto h-full">
                <BiSolidQuoteAltRight className="text-primary-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
