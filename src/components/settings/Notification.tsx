import React from "react";
import CheckBoxComp from "../input/CheckBoxComp";

interface NotificationSettingsProps {
  messageNotification: boolean;
  taskUpdate: boolean;
  taskDeadline: boolean;
  associateInvite: boolean;
  handleUserNotificationSettings: (
    name: "message_notification" | "task_update" | "task_deadline" | "associate_invite"
  ) => void;
  updateUserSettings: () => Promise<void>;
}

const Notification: React.FC<NotificationSettingsProps> = (props) => {
  return (
    <div className="bg-white w-full p-4 flex flex-col gap-8 rounded-lg h-fit">
      <div className="flex flex-col w-full items-start justify-center gap-4 text-sm">
        <CheckBoxComp
          isActive={props.messageNotification}
          label="Messages"
          onClick={() => props.handleUserNotificationSettings("message_notification")}
        />

        <CheckBoxComp
          isActive={props.taskUpdate}
          label="Task Update"
          onClick={() => props.handleUserNotificationSettings("task_update")}
        />

        <CheckBoxComp
          isActive={props.taskDeadline}
          label="Task Deadline"
          onClick={() => props.handleUserNotificationSettings("task_deadline")}
        />

        <CheckBoxComp
          isActive={props.associateInvite}
          label="Associate Invites"
          onClick={() => props.handleUserNotificationSettings("associate_invite")}
        />
      </div>

      <button
        onClick={props.updateUserSettings}
        className="bg-primary-500 text-white font-semibold 
                        p-2 rounded-lg t:w-fit t:px-10"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Notification;
