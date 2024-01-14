import { useGlobalContext } from "@/base/context";
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

export default function useSettings() {
  const [settings, setSettings] = React.useState<SettingsStateProps>({
    notification_sound: 50,
    associate_invite: true,
    message_notification: true,
    task_deadline: true,
    task_update: true,
  });

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getUserSettings = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/user_settings`, { headers: { Authorization: user?.token } });
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

  return { settings };
}
