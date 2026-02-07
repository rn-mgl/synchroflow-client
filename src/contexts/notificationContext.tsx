import useLoader from "@/src/hooks/useLoading";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { RefObject } from "react";
import { useGlobalContext } from "./context";
import { useSettings } from "./settingsContext";

interface NotificationsStateProps {
  from_image: string;
  name: string;
  purpose: string;
  surname: string;
  title: string;
  notif_date: string;
}

interface NotificationContextInterface {
  notificationIsVisible: boolean;
  notifications: NotificationsStateProps[];
  notificationAudio: RefObject<HTMLAudioElement | null>;
  checkedNotifications: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  toggleNotificationIsVisible: () => void;
  toggleCheckedNotifications: (checked: boolean) => void;
  getNotifications: () => Promise<void>;
}

const NotificationContext =
  React.createContext<NotificationContextInterface | null>(null);

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = React.useState<
    NotificationsStateProps[]
  >([]);

  const [notificationIsVisible, setNotificationIsVisible] =
    React.useState(false);

  const [checkedNotifications, setCheckedNotifications] = React.useState(true);

  const [notificationLimit, setNotificationLimit] = React.useState(10);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const notificationAudio = React.useRef<HTMLAudioElement | null>(null);

  const { isLoading, handleLoader } = useLoader();

  const { socket } = useGlobalContext();

  const { settings } = useSettings();

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
    if (user?.token && !isLoading) {
      try {
        handleLoader(true);
        const { data } = await axios.get(`${url}/notifications`, {
          headers: { Authorization: user?.token },
          params: { limit: notificationLimit },
        });
        if (data) {
          setNotifications(data);
          setNotificationLimit((prev) => prev + 5);
        }
      } catch (error) {
        console.log(error);
      } finally {
        handleLoader(false);
      }
    }
  }, [url, user, notificationLimit, isLoading, handleLoader]);

  React.useEffect(() => {
    if (!scrollRef.current) return;

    const notificationContainer = scrollRef.current;

    const handleScroll = () => {
      if (
        Math.floor(
          notificationContainer.scrollHeight -
            notificationContainer.scrollTop -
            notificationContainer.clientHeight,
        ) <= 10
      ) {
        getNotifications();
      }
    };

    notificationContainer.addEventListener("scroll", handleScroll);

    return () => {
      notificationContainer.removeEventListener("scroll", handleScroll);
    };
  }, [getNotifications]);

  React.useEffect(() => {
    const LISTEN_TO = [
      {
        event: "reflect_send_task_invite",
        setting: "task_update",
      },
      {
        event: "reflect_send_associate_invite",
        setting: "task_update",
      },
      {
        event: "receive_messages",
        setting: "message_notification",
      },
      {
        event: "reflect_add_group_member",
        setting: "associate_invite",
      },
      {
        event: "reflect_assign_sub_task",
        setting: "task_update",
      },
    ];

    const handle = (setting: string) => {
      toggleCheckedNotifications(false);

      if (
        notificationAudio.current &&
        settings[setting as keyof object] == true
      ) {
        notificationAudio.current.play();
      }
    };

    LISTEN_TO.forEach((listen) =>
      socket?.on(listen.event, () => handle(listen.setting)),
    );

    return () => {
      LISTEN_TO.forEach((listen) =>
        socket?.off(listen.event, () => handle(listen.setting)),
      );
    };
  }, [socket, settings, toggleCheckedNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notificationIsVisible,
        notifications,
        checkedNotifications,
        scrollRef,
        notificationAudio,
        toggleNotificationIsVisible,
        toggleCheckedNotifications,
        getNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };

export const useNotificationContext = () => {
  const context = React.useContext(NotificationContext);

  if (!context) {
    throw new Error(`No context created for notifications.`);
  }

  return context;
};
