"use client";
import { useGlobalContext } from "@/base/context";
import General from "@/components//settings/General";
import Notification from "@/components//settings/Notification";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface UserSettingsStateProps {
  notification_sound: number;
  message_notification: boolean;
  task_update: boolean;
  task_deadline: boolean;
  associate_invite: boolean;
}

const Settings = () => {
  const [activeNav, setActiveNav] = React.useState<"general" | "notification">("general");
  const [userSettings, setUserSettings] = React.useState<UserSettingsStateProps>({
    notification_sound: 50,
    message_notification: false,
    task_update: false,
    task_deadline: false,
    associate_invite: false,
  });

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const handleActiveNav = (type: "general" | "notification") => {
    setActiveNav(type);
  };

  const handleUserGeneralSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserSettings((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUserNotificationSettings = (
    name: "message_notification" | "task_update" | "task_deadline" | "associate_invite"
  ) => {
    setUserSettings((prev) => {
      return {
        ...prev,
        [name]: !prev[name],
      };
    });
  };

  const getUserSettings = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/user_settings`, { headers: { Authorization: user?.token } });
        if (data) {
          setUserSettings(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const updateUserSettings = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/user_settings`,
        { userSettings },
        { headers: { Authorization: user?.token } }
      );
      if (data) {
        await getUserSettings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getUserSettings();
  }, [getUserSettings]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
            items-center w-full h-full"
      >
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="bg-white w-full p-4 pb-0 flex flex-col gap-4 rounded-lg h-fit">
            <p className="font-semibold text-xl">Settings</p>

            <div className="flex flex-row w-full items-center justify-start gap-2 text-sm">
              <button
                onClick={() => handleActiveNav("general")}
                className={`p-4 hover:bg-neutral-100 transition-all
                      ${activeNav === "general" && "border-b-2 border-primary-500"}`}
              >
                General
              </button>
              <button
                onClick={() => handleActiveNav("notification")}
                className={`p-4 hover:bg-neutral-100 transition-all
                        ${activeNav === "notification" && "border-b-2 border-primary-500"}`}
              >
                Notification
              </button>
            </div>
          </div>

          {activeNav === "general" ? (
            <General
              notificationSound={userSettings.notification_sound}
              handleUserGeneralSettings={handleUserGeneralSettings}
              updateUserSettings={updateUserSettings}
            />
          ) : activeNav === "notification" ? (
            <Notification
              messageNotification={userSettings.message_notification}
              taskUpdate={userSettings.task_update}
              taskDeadline={userSettings.task_deadline}
              associateInvite={userSettings.associate_invite}
              handleUserNotificationSettings={handleUserNotificationSettings}
              updateUserSettings={updateUserSettings}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Settings;
