import { RefObject } from "react";

export interface NotificationsStateProps {
  from_image: string;
  name: string;
  purpose: string;
  surname: string;
  title: string;
  notif_date: string;
}

export interface NotificationContextInterface {
  notificationIsVisible: boolean;
  notifications: NotificationsStateProps[];
  notificationAudio: RefObject<HTMLAudioElement | null>;
  checkedNotifications: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  toggleNotificationIsVisible: () => void;
  toggleCheckedNotifications: (checked: boolean) => void;
  getNotifications: () => Promise<void>;
}
