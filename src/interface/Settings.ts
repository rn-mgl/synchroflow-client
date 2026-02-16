export interface SettingsStateProps {
  notification_sound: number;
  message_notification: boolean;
  task_update: boolean;
  task_deadline: boolean;
  associate_invite: boolean;
}

export interface SettingsContextInterface {
  settings: SettingsStateProps;
  handleUserGeneralSettings: (
    e: React.ChangeEvent<HTMLInputElement>,
    audioRef: React.RefObject<HTMLAudioElement | null>,
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
