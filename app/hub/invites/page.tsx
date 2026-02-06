"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import ReceivedAssociateInvitesCard from "@/components/invites/ReceivedAssociateInvitesCard";
import ReceivedTaskInvitesCard from "@/components/invites/ReceivedTaskInvitesCard";
import SentAssociateInvitesCard from "@/components/invites/SentAssociateInvitesCard";
import SentTaskInvitesCard from "@/components/invites/SentTaskInvitesCard";
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

  const mappedSentTaskInvites = sentTaskInvites.map((taskInvite, index) => {
    const targetIdentity =
      parseInt(taskInvite.from_user) === user?.id ? "invited" : "from"; // check if im the sender and use the other user's data
    const name = taskInvite[`${targetIdentity}_name`];
    const surname = taskInvite[`${targetIdentity}_surname`];
    const email = taskInvite[`${targetIdentity}_email`];

    return (
      <SentTaskInvitesCard
        key={taskInvite.invited_user_uuid}
        name={name}
        surname={surname}
        email={email}
        invite_uuid={taskInvite.task_invite_uuid}
        title={taskInvite.title}
        banner={taskInvite.banner}
        priority={taskInvite.priority}
        message={taskInvite.message}
        removeSentTaskInvites={() =>
          removeSentTaskInvites(
            taskInvite.task_invite_uuid,
            taskInvite.invited_user_uuid,
            taskInvite.from_user_uuid,
          )
        }
      />
    );
  });

  const mappedReceivedTaskInvites = receivedTaskInvites.map(
    (taskInvite, index) => {
      const targetIdentity =
        parseInt(taskInvite.from_user) == user?.id ? "invited" : "from"; // check if im the invited and use my data
      const name = taskInvite[`${targetIdentity}_name`];
      const surname = taskInvite[`${targetIdentity}_surname`];
      const email = taskInvite[`${targetIdentity}_email`];
      return (
        <ReceivedTaskInvitesCard
          key={taskInvite.from_user_uuid}
          name={name}
          surname={surname}
          email={email}
          task_invite_uuid={taskInvite.task_invite_uuid}
          title={taskInvite.title}
          banner={taskInvite.banner}
          priority={taskInvite.priority}
          message={taskInvite.message}
          declineReceivedTaskInvites={() =>
            removeSentTaskInvites(
              taskInvite.task_invite_uuid,
              taskInvite.invited_user_uuid,
              taskInvite.from_user_uuid,
            )
          }
          acceptReceivedTaskInvites={() =>
            acceptReceivedTaskInvites(
              taskInvite.task_uuid,
              taskInvite.invited_user_uuid,
              taskInvite.task_invite_uuid,
              taskInvite.from_user_uuid,
            )
          }
        />
      );
    },
  );

  const mappedSentAssociateInvites = sentAssociateInvites.map(
    (associateInvite, index) => {
      const targetIdentity =
        parseInt(associateInvite.from_user) == user?.id ? "invited" : "from"; // check if im the invited and use my data
      const image = associateInvite[`${targetIdentity}_image`];
      const name = associateInvite[`${targetIdentity}_name`];
      const surname = associateInvite[`${targetIdentity}_surname`];
      const email = associateInvite[`${targetIdentity}_email`];
      return (
        <SentAssociateInvitesCard
          key={associateInvite.invited_user_uuid}
          image={image}
          name={name}
          surname={surname}
          email={email}
          removeSentAssociateInvites={() =>
            removeSentAssociateInvites(
              associateInvite.associate_invite_uuid,
              associateInvite.invited_user_uuid,
              associateInvite.from_user_uuid,
            )
          }
        />
      );
    },
  );

  const mappedReceivedAssociateInvites = receivedAssociateInvites.map(
    (associateInvite, index) => {
      const targetIdentity =
        parseInt(associateInvite.from_user) == user?.id ? "invited" : "from"; // check if im the invited and use my data
      const image = associateInvite[`${targetIdentity}_image`];
      const name = associateInvite[`${targetIdentity}_name`];
      const surname = associateInvite[`${targetIdentity}_surname`];
      const email = associateInvite[`${targetIdentity}_email`];
      return (
        <ReceivedAssociateInvitesCard
          key={associateInvite.from_user_uuid}
          image={image}
          name={name}
          surname={surname}
          email={email}
          declineReceivedAssociateInvites={() =>
            removeSentAssociateInvites(
              associateInvite.associate_invite_uuid,
              associateInvite.invited_user_uuid,
              associateInvite.from_user_uuid,
            )
          }
          acceptReceivedAssociateInvites={() =>
            acceptReceivedAssociateInvites(
              associateInvite.associate_invite_uuid,
              associateInvite.invited_user_uuid,
              associateInvite.from_user_uuid,
            )
          }
        />
      );
    },
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
          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 h-auto min-h-[20rem]">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Sent Task Invites</p>
            </div>

            <div
              className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-start justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-4"
            >
              {mappedSentTaskInvites}
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 h-auto min-h-[20rem]">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Received Task Invites</p>
            </div>

            <div
              className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-start justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-4"
            >
              {mappedReceivedTaskInvites}
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 h-auto min-h-[20rem]">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Sent Associate Invites</p>
            </div>

            <div
              className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-start justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-4"
            >
              {mappedSentAssociateInvites}
            </div>
          </div>

          <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 h-auto min-h-[20rem]">
            <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
              <p>Received Associate Invites</p>
            </div>

            <div
              className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-start justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-4"
            >
              {mappedReceivedAssociateInvites}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invites;
