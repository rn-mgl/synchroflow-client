import useLoader from "@/components/hooks/useLoading";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { RefObject } from "react";

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
  checkedNotifications: boolean;
  scrollRef: RefObject<HTMLDivElement>;
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

  const [checkedNotifications, setCheckedNotifications] = React.useState(false);

  const [notificationLimit, setNotificationLimit] = React.useState(10);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const { isLoading, handleLoader } = useLoader();

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
  }, [url, user?.token, notificationLimit, isLoading, handleLoader]);

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

  return (
    <NotificationContext.Provider
      value={{
        notificationIsVisible,
        notifications,
        checkedNotifications,
        scrollRef,
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
