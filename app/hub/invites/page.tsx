"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import AssociateInvitesSection from "@/src/components/invites/AssociateInvitesSection";
import TaskInvitesSection from "@/src/components/invites/TaskInvitesSection";
import useInvites from "@/src/hooks/useInvites";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Invites = () => {
  const {
    sentTaskInvites,
    receivedTaskInvites,
    sentAssociateInvites,
    receivedAssociateInvites,
    getSentTaskInvites,
    getReceivedTaskInvites,
    getSentAssociateInvites,
    getReceivedAssociateInvites,
  } = useInvites();

  const { socket } = useGlobalContext();
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const removeSentTaskInvites = React.useCallback(
    async (
      inviteUUID: string,
      invitedUserUUID: string,
      inviteFromUUID: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.delete(
            `${url}/task_invites/${inviteUUID}`,
            {
              headers: { Authorization: user?.token },
            },
          );

          if (data) {
            await getSentTaskInvites();
            await getReceivedTaskInvites();
            socket?.emit("remove_task_invite", {
              inviteUUID,
              invitedRoom: invitedUserUUID,
              fromRoom: inviteFromUUID,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [socket, url, user, getReceivedTaskInvites, getSentTaskInvites],
  );

  const acceptReceivedTaskInvites = React.useCallback(
    async (
      taskUUID: string,
      invitedUserUUID: string,
      inviteUUID: string,
      inviteFromUUID: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.post(
            `${url}/task_collaborators`,
            { taskUUID, collaboratorUUID: invitedUserUUID },
            { headers: { Authorization: user?.token } },
          );
          if (data) {
            await removeSentTaskInvites(
              inviteUUID,
              invitedUserUUID,
              inviteFromUUID,
            );
            socket?.emit("accept_task_invite", {
              inviteUUID,
              invitedRoom: invitedUserUUID,
              fromRoom: inviteFromUUID,
              taskUUID,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [socket, url, user, removeSentTaskInvites],
  );

  const removeSentAssociateInvites = React.useCallback(
    async (
      inviteUUID: string,
      invitedUserUUID: string,
      inviteFromUUID: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.delete(
            `${url}/associate_invites/${inviteUUID}`,
            {
              headers: { Authorization: user?.token },
              params: { type: "sent" },
            },
          );

          if (data) {
            await getSentAssociateInvites();
            await getReceivedAssociateInvites();
            socket?.emit("remove_associate_invite", {
              inviteUUID,
              invitedRoom: invitedUserUUID,
              fromRoom: inviteFromUUID,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [user, url, socket, getSentAssociateInvites, getReceivedAssociateInvites],
  );

  const acceptReceivedAssociateInvites = React.useCallback(
    async (
      inviteUUID: string,
      invitedUserUUID: string,
      inviteFromUUID: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.post(
            `${url}/associates`,
            { userUUID: inviteFromUUID },
            { headers: { Authorization: user?.token } },
          );
          if (data) {
            await removeSentAssociateInvites(
              inviteUUID,
              invitedUserUUID,
              inviteFromUUID,
            );
            socket?.emit("accept_associate_invite", {
              inviteUUID,
              invitedRoom: invitedUserUUID,
              fromRoom: inviteFromUUID,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [socket, url, user, removeSentAssociateInvites],
  );

  React.useEffect(() => {
    getSentTaskInvites();
  }, [getSentTaskInvites]);

  React.useEffect(() => {
    getReceivedTaskInvites();
  }, [getReceivedTaskInvites]);

  React.useEffect(() => {
    getSentAssociateInvites();
  }, [getSentAssociateInvites]);

  React.useEffect(() => {
    getReceivedAssociateInvites();
  }, [getReceivedAssociateInvites]);

  React.useEffect(() => {
    const handle = async () => {
      await getReceivedTaskInvites();
    };

    socket?.on("reflect_send_task_invite", handle);

    return () => {
      socket?.off("reflect_send_task_invite", handle);
    };
  }, [socket, getReceivedTaskInvites]);

  React.useEffect(() => {
    const handle = async () => {
      await getReceivedAssociateInvites();
    };

    socket?.on("reflect_send_associate_invite", handle);

    return () => {
      socket?.off("reflect_send_associate_invite", handle);
    };
  }, [socket, getReceivedAssociateInvites]);

  React.useEffect(() => {
    const handle = async (args: {
      inviteUUID: string;
      invitedRoom: string;
      fromRoom: string;
    }) => {
      await removeSentAssociateInvites(
        args.inviteUUID,
        args.invitedRoom,
        args.fromRoom,
      );
    };

    socket?.on("reflect_remove_associate_invite", handle);

    return () => {
      socket?.off("reflect_remove_associate_invite", handle);
    };
  }, [socket, removeSentAssociateInvites]);

  React.useEffect(() => {
    const handle = async (args: {
      inviteUUID: string;
      invitedRoom: string;
      fromRoom: string;
    }) => {
      await removeSentTaskInvites(
        args.inviteUUID,
        args.invitedRoom,
        args.fromRoom,
      );
    };

    socket?.on("reflect_remove_task_invite", handle);

    return () => {
      socket?.off("reflect_remove_task_invite", handle);
    };
  }, [socket, removeSentTaskInvites]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div className="max-w-screen-2xl flex flex-col justify-start items-center w-full h-auto">
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <TaskInvitesSection
            invites={sentTaskInvites}
            type="sent"
            userId={user?.id ?? 0}
            label="Sent Task Invites"
            acceptReceivedTaskInvites={acceptReceivedTaskInvites}
            removeSentTaskInvites={removeSentTaskInvites}
          />

          <TaskInvitesSection
            invites={receivedTaskInvites}
            type="received"
            userId={user?.id ?? 0}
            label="Received Task Invites"
            acceptReceivedTaskInvites={acceptReceivedTaskInvites}
            removeSentTaskInvites={removeSentTaskInvites}
          />

          <AssociateInvitesSection
            acceptReceivedAssociateInvites={acceptReceivedAssociateInvites}
            removeSentAssociateInvites={removeSentAssociateInvites}
            invites={sentAssociateInvites}
            label="Sent Associate Invites"
            type="sent"
            userId={user?.id ?? 0}
          />

          <AssociateInvitesSection
            acceptReceivedAssociateInvites={acceptReceivedAssociateInvites}
            removeSentAssociateInvites={removeSentAssociateInvites}
            invites={receivedAssociateInvites}
            label="Received Associate Invites"
            type="received"
            userId={user?.id ?? 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Invites;
