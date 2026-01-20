"use client";
import { useGlobalContext } from "@/base/src/contexts/context";
import General from "@/components/settings/General";
import Notification from "@/components/settings/Notification";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
// import notificationSound from "@/public/music/NotificationSound.mp3";
import useAudio from "@/components/hooks/useAudio";
import { useSettings } from "@/base/src/contexts/settingsContext";

const Settings = () => {
  const [activeNav, setActiveNav] = React.useState<"general" | "notification">(
    "general",
  );

  const {
    settings,
    getUserSettings,
    handleUserGeneralSettings,
    handleUserNotificationSettings,
  } = useSettings();

  const { audioRef } = useAudio();

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const handleActiveNav = (type: "general" | "notification") => {
    setActiveNav(type);
  };

  const updateUserSettings = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/user_settings`,
        { settings },
        { headers: { Authorization: user?.token } },
      );
      if (data) {
        await getUserSettings();
      }
    } catch (error) {
      console.log(error);
    }
  };

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
                      ${
                        activeNav === "general" &&
                        "border-b-2 border-primary-500"
                      }`}
              >
                General
              </button>
              <button
                onClick={() => handleActiveNav("notification")}
                className={`p-4 hover:bg-neutral-100 transition-all
                        ${
                          activeNav === "notification" &&
                          "border-b-2 border-primary-500"
                        }`}
              >
                Notification
              </button>
            </div>
          </div>

          {activeNav === "general" ? (
            <General
              notificationSound={settings.notification_sound}
              handleUserGeneralSettings={handleUserGeneralSettings}
              updateUserSettings={updateUserSettings}
              audioRef={audioRef}
            />
          ) : activeNav === "notification" ? (
            <Notification
              messageNotification={settings.message_notification}
              taskUpdate={settings.task_update}
              taskDeadline={settings.task_deadline}
              associateInvite={settings.associate_invite}
              handleUserNotificationSettings={handleUserNotificationSettings}
              updateUserSettings={updateUserSettings}
            />
          ) : null}
        </div>
      </div>

      <audio ref={audioRef}>
        <source
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/music/NotificationSound.mp3`}
        />
      </audio>
    </div>
  );
};

export default Settings;
