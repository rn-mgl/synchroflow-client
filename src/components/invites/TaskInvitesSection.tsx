import { TaskInvitesStateProps } from "@/src/interface/Invites";
import React from "react";
import TaskInvitesCard from "./TaskInvitesCard";

interface TaskInvitesSectionProps {
  type: "sent" | "received";
  userId: number;
  invites: TaskInvitesStateProps[];
  label: string;
  removeSentTaskInvites: (
    inviteUUID: string,
    invitedUserUUID: string,
    inviteFromUUID: string,
  ) => Promise<void>;
  acceptReceivedTaskInvites: (
    taskUUID: string,
    invitedUserUUID: string,
    inviteUUID: string,
    inviteFromUUID: string,
  ) => Promise<void>;
}

const TaskInvitesSection: React.FC<TaskInvitesSectionProps> = (props) => {
  const mappedInvites = props.invites.map((taskInvite, index) => {
    const targetIdentity =
      parseInt(taskInvite.from_user) === props.userId ? "invited" : "from"; // check if im the sender and use the other user's data
    const name = taskInvite[`${targetIdentity}_name`];
    const surname = taskInvite[`${targetIdentity}_surname`];
    const email = taskInvite[`${targetIdentity}_email`];

    return (
      <TaskInvitesCard
        type="sent"
        key={taskInvite.task_invite_uuid}
        name={name}
        surname={surname}
        email={email}
        invite_uuid={taskInvite.task_invite_uuid}
        title={taskInvite.title}
        banner={taskInvite.banner}
        priority={taskInvite.priority}
        message={taskInvite.message}
        removeSentTaskInvites={
          props.type === "sent"
            ? () =>
                props.removeSentTaskInvites(
                  taskInvite.task_invite_uuid,
                  taskInvite.invited_user_uuid,
                  taskInvite.from_user_uuid,
                )
            : undefined
        }
        declineReceivedTaskInvites={
          props.type === "received"
            ? () =>
                props.removeSentTaskInvites(
                  taskInvite.task_invite_uuid,
                  taskInvite.invited_user_uuid,
                  taskInvite.from_user_uuid,
                )
            : undefined
        }
        acceptReceivedTaskInvites={
          props.type === "received"
            ? () =>
                props.acceptReceivedTaskInvites(
                  taskInvite.task_uuid,
                  taskInvite.task_invite_uuid,
                  taskInvite.invited_user_uuid,
                  taskInvite.from_user_uuid,
                )
            : undefined
        }
      />
    );
  });

  return (
    <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 h-auto min-h-[20rem]">
      <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
        <p>{props.label}</p>
      </div>

      <div
        className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-start justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-4"
      >
        {mappedInvites}
      </div>
    </div>
  );
};

export default TaskInvitesSection;
