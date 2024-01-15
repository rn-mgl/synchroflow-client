"use client";

import { useGlobalContext } from "@/base/context";
import useInvites from "@/components//hooks/useInvites";
import useNotification from "@/components//hooks/useNotification";
import ReceivedAssociateInvitesCard from "@/components//invites/ReceivedAssociateInvitesCard";
import ReceivedTaskInvitesCard from "@/components//invites/ReceivedTaskInvitesCard";
import SentAssociateInvitesCard from "@/components//invites/SentAssociateInvitesCard";
import SentTaskInvitesCard from "@/components//invites/SentTaskInvitesCard";
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
  const { getNotifications } = useNotification();

  const { url, socket } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const removeSentTaskInvites = React.useCallback(
    async (inviteUUID: string, invitedUserUUID: string, inviteFromUUID: string) => {
      if (user?.token) {
        try {
          const { data } = await axios.delete(`${url}/main_task_invites/${inviteUUID}`, {
            headers: { Authorization: user?.token },
          });

          if (data) {
            await getSentTaskInvites();
            await getReceivedTaskInvites();
            socket.emit("remove_task_invite", { inviteUUID, invitedRoom: invitedUserUUID, fromRoom: inviteFromUUID });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [socket, url, user?.token, getReceivedTaskInvites, getSentTaskInvites]
  );

  const acceptReceivedTaskInvites = React.useCallback(
    async (mainTaskUUID: string, invitedUserUUID: string, inviteUUID: string, inviteFromUUID: string) => {
      if (user?.token) {
        try {
          const { data } = await axios.post(
            `${url}/main_task_collaborators`,
            { mainTaskUUID, collaboratorUUID: invitedUserUUID },
            { headers: { Authorization: user?.token } }
          );
          if (data) {
            await removeSentTaskInvites(inviteUUID, invitedUserUUID, inviteFromUUID);
            socket.emit("accept_task_invite", {
              inviteUUID,
              invitedRoom: invitedUserUUID,
              fromRoom: inviteFromUUID,
              mainTaskUUID,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [socket, url, user?.token, removeSentTaskInvites]
  );

  const removeSentAssociateInvites = React.useCallback(
    async (inviteUUID: string, invitedUserUUID: string, inviteFromUUID: string) => {
      if (user?.token) {
        try {
          const { data } = await axios.delete(`${url}/associate_invites/${inviteUUID}`, {
            headers: { Authorization: user?.token },
            params: { type: "sent" },
          });

          if (data) {
            await getSentAssociateInvites();
            await getReceivedAssociateInvites();
            socket.emit("remove_associate_invite", {
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
    [user?.token, url, socket, getSentAssociateInvites, getReceivedAssociateInvites]
  );

  const acceptReceivedAssociateInvites = React.useCallback(
    async (inviteUUID: string, invitedUserUUID: string, inviteFromUUID: string) => {
      if (user?.token) {
        try {
          const { data } = await axios.post(
            `${url}/associates`,
            { userUUID: inviteFromUUID },
            { headers: { Authorization: user?.token } }
          );
          if (data) {
            await removeSentAssociateInvites(inviteUUID, invitedUserUUID, inviteFromUUID);
            socket.emit("accept_associate_invite", {
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
    [socket, url, user?.token, removeSentAssociateInvites]
  );

  const mappedSentTaskInvites = sentTaskInvites.map((taskInvite, index) => {
    const targetIdentity = taskInvite.from_user_id === user?.id ? "invited" : "from"; // check if im the sender and use the other user's data
    const name = taskInvite[`${targetIdentity}_name`];
    const surname = taskInvite[`${targetIdentity}_surname`];
    const email = taskInvite[`${targetIdentity}_email`];
    return (
      <SentTaskInvitesCard
        key={index}
        name={name}
        surname={surname}
        email={email}
        main_task_invite_uuid={taskInvite.main_task_invite_uuid}
        main_task_title={taskInvite.main_task_title}
        main_task_banner={taskInvite.main_task_banner}
        main_task_priority={taskInvite.main_task_priority}
        removeSentTaskInvites={() =>
          removeSentTaskInvites(
            taskInvite.main_task_invite_uuid,
            taskInvite.invited_user_uuid,
            taskInvite.from_user_uuid
          )
        }
      />
    );
  });

  const mappedReceivedTaskInvites = receivedTaskInvites.map((taskInvite, index) => {
    const targetIdentity = taskInvite.from_user_id === user?.id ? "invited" : "from"; // check if im the invited and use my data
    const name = taskInvite[`${targetIdentity}_name`];
    const surname = taskInvite[`${targetIdentity}_surname`];
    const email = taskInvite[`${targetIdentity}_email`];
    return (
      <ReceivedTaskInvitesCard
        key={index}
        name={name}
        surname={surname}
        email={email}
        main_task_invite_uuid={taskInvite.main_task_invite_uuid}
        main_task_title={taskInvite.main_task_title}
        main_task_banner={taskInvite.main_task_banner}
        main_task_priority={taskInvite.main_task_priority}
        declineReceivedTaskInvites={() =>
          removeSentTaskInvites(
            taskInvite.main_task_invite_uuid,
            taskInvite.invited_user_uuid,
            taskInvite.from_user_uuid
          )
        }
        acceptReceivedTaskInvites={() =>
          acceptReceivedTaskInvites(
            taskInvite.main_task_uuid,
            taskInvite.invited_user_uuid,
            taskInvite.main_task_invite_uuid,
            taskInvite.from_user_uuid
          )
        }
      />
    );
  });

  const mappedSentAssociateInvites = sentAssociateInvites.map((associateInvite, index) => {
    const targetIdentity = associateInvite.from_user_id === user?.id ? "invited" : "from"; // check if im the invited and use my data
    const image = associateInvite[`${targetIdentity}_image`];
    const name = associateInvite[`${targetIdentity}_name`];
    const surname = associateInvite[`${targetIdentity}_surname`];
    const email = associateInvite[`${targetIdentity}_email`];
    return (
      <SentAssociateInvitesCard
        key={index}
        image={image}
        name={name}
        surname={surname}
        email={email}
        removeSentAssociateInvites={() =>
          removeSentAssociateInvites(
            associateInvite.associate_invite_uuid,
            associateInvite.invited_user_uuid,
            associateInvite.from_user_uuid
          )
        }
      />
    );
  });

  const mappedReceivedAssociateInvites = receivedAssociateInvites.map((associateInvite, index) => {
    const targetIdentity = associateInvite.from_user_id === user?.id ? "invited" : "from"; // check if im the invited and use my data
    const image = associateInvite[`${targetIdentity}_image`];
    const name = associateInvite[`${targetIdentity}_name`];
    const surname = associateInvite[`${targetIdentity}_surname`];
    const email = associateInvite[`${targetIdentity}_email`];
    return (
      <ReceivedAssociateInvitesCard
        key={index}
        image={image}
        name={name}
        surname={surname}
        email={email}
        declineReceivedAssociateInvites={() =>
          removeSentAssociateInvites(
            associateInvite.associate_invite_uuid,
            associateInvite.invited_user_uuid,
            associateInvite.from_user_uuid
          )
        }
        acceptReceivedAssociateInvites={() =>
          acceptReceivedAssociateInvites(
            associateInvite.associate_invite_uuid,
            associateInvite.invited_user_uuid,
            associateInvite.from_user_uuid
          )
        }
      />
    );
  });

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
    socket.on("reflect_send_main_task_invite", async () => {
      await getReceivedTaskInvites();
    });
  }, [socket, getReceivedTaskInvites]);

  React.useEffect(() => {
    socket.on("reflect_send_associate_invite", async () => {
      await getReceivedAssociateInvites();
      await getNotifications();
    });
  }, [socket, getReceivedAssociateInvites, getNotifications]);

  React.useEffect(() => {
    socket.on(
      "reflect_remove_associate_invite",
      async (args: { inviteUUID: string; invitedRoom: string; fromRoom: string }) => {
        await removeSentAssociateInvites(args.inviteUUID, args.invitedRoom, args.fromRoom);
      }
    );
  }, [socket, removeSentAssociateInvites]);

  React.useEffect(() => {
    socket.on(
      "reflect_remove_task_invite",
      async (args: { inviteUUID: string; invitedRoom: string; fromRoom: string }) => {
        await removeSentTaskInvites(args.inviteUUID, args.invitedRoom, args.fromRoom);
      }
    );
  }, [socket, removeSentTaskInvites]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
            items-center w-full h-full"
      >
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-80">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Sent Task Invites</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className={`absolute w-full h-full flex flex-row gap-4 items-center 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar ${
                    sentTaskInvites.length ? "justify-start" : "justify-center"
                  }`}
              >
                {sentTaskInvites.length ? (
                  mappedSentTaskInvites
                ) : (
                  <p className="opacity-50 select-none">no sent invites</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-[26rem] ">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Received Task Invites</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className={`absolute w-full h-full flex flex-row gap-4 items-center 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar ${
                    receivedTaskInvites.length ? "justify-start" : "justify-center"
                  }`}
              >
                {receivedTaskInvites.length ? (
                  mappedReceivedTaskInvites
                ) : (
                  <p className="opacity-50 select-none">no received invites</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-80">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Sent Associate Invites</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className={`absolute w-full h-full flex flex-row gap-4 items-center 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar ${
                    sentAssociateInvites.length ? "justify-start" : "justify-center"
                  }`}
              >
                {sentAssociateInvites.length ? (
                  mappedSentAssociateInvites
                ) : (
                  <p className="opacity-50 select-none">no sent invites</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-[26rem]">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Received Associate Invites</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className={`absolute w-full h-full flex flex-row gap-4 items-center 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar ${
                    receivedAssociateInvites.length ? "justify-start" : "justify-center"
                  }`}
              >
                {receivedAssociateInvites.length ? (
                  mappedReceivedAssociateInvites
                ) : (
                  <p className="opacity-50 select-none">no received invites</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invites;
