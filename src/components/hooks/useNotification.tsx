import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface NotificationsStateProps {
  from_image: string;
  name: string;
  purpose: string;
  surname: string;
  title: string;
  notif_date: string;
}

export default function useNotification() {
  const [notificationIsVisible, setNotificationIsVisible] =
    React.useState(false);
  const [notifications, setNotifications] = React.useState<
    Array<NotificationsStateProps>
  >([]);
  const [checkedNotifications, setCheckedNotifications] = React.useState(false);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const toggleNotificationIsVisible = React.useCallback(() => {
    setNotificationIsVisible((prev) => !prev);
  }, []);

  const toggleCheckedNotifications = React.useCallback((checked: boolean) => {
    setCheckedNotifications(checked);
  }, []);

  const getNotifications = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/notifications`, {
          headers: { Authorization: user?.token },
        });
        if (data) {
          setNotifications(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  return {
    notificationIsVisible,
    notifications,
    checkedNotifications,
    toggleNotificationIsVisible,
    toggleCheckedNotifications,
    getNotifications,
  };
}
