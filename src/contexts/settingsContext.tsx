import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface SettingsStateProps {
  notification_sound: number;
  message_notification: boolean;
  task_update: boolean;
  task_deadline: boolean;
  associate_invite: boolean;
}

interface SettingsContextInterface {
  settings: SettingsStateProps;
  handleUserGeneralSettings: (
    e: React.ChangeEvent<HTMLInputElement>,
    audioRef: React.RefObject<HTMLAudioElement>,
  ) => void;
  handleUserNotificationSettings: (
    name:
      | "message_notification"
      | "task_update"
      | "task_deadline"
      | "associate_invite",
  ) => void;
  getUserSettings: () => Promise<void>;
}

const SettingsContext = React.createContext<SettingsContextInterface | null>(
  null,
);

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = React.useState<SettingsStateProps>({
    notification_sound: 50,
    associate_invite: true,
    message_notification: true,
    task_deadline: true,
    task_update: true,
  });

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const handleUserGeneralSettings = React.useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      audioRef: React.RefObject<HTMLAudioElement>,
    ) => {
      const { name, value } = e.target;

      setSettings((prev) => {
        if (name === "notification_sound" && audioRef.current) {
          const newVolume = parseInt(value) / 100;
          audioRef.current.volume = newVolume;
          audioRef.current.play();
        }
        return {
          ...prev,
          [name]: value,
        };
      });
    },
    [],
  );

  const handleUserNotificationSettings = React.useCallback(
    (
      name:
        | "message_notification"
        | "task_update"
        | "task_deadline"
        | "associate_invite",
    ) => {
      setSettings((prev) => {
        return {
          ...prev,
          [name]: !prev[name],
        };
      });
    },
    [],
  );

  const getUserSettings = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/user_settings`, {
          headers: { Authorization: user?.token },
        });
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  React.useEffect(() => {
    getUserSettings();
  }, [getUserSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        getUserSettings,
        handleUserGeneralSettings,
        handleUserNotificationSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return React.useContext(SettingsContext)!;
};

export { SettingsContext, SettingsProvider };
