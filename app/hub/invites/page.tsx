"use client";

import { useGlobalContext } from "@/base/context";
import useInvites from "@/components//hooks/useInvites";
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

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const removeSentTaskInvites = async () => {
    try {
      const { data } = await axios.delete(`${url}/main_task_invites`, {
        headers: { Authorization: user?.token },
        params: { type: "sent" },
      });
      if (data) {
        getSentTaskInvites();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateReceivedTaskInvites = async (type: "accept" | "decline") => {
    try {
      const { data } = await axios.patch(`${url}/main_task_invites`, {
        headers: { Authorization: user?.token },
        params: { type: "received" },
      });
      if (data) {
        getReceivedTaskInvites();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeSentAssociateInvites = async () => {
    try {
      const { data } = await axios.delete(`${url}/associate_invites`, {
        headers: { Authorization: user?.token },
        params: { type: "sent" },
      });
      if (data) {
        getSentAssociateInvites();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateReceivedAssociateInvites = async (type: "accept" | "decline") => {
    try {
      const { data } = await axios.patch(`${url}/associate_invites`, {
        headers: { Authorization: user?.token },
        params: { type: "received" },
      });
      if (data) {
        getReceivedAssociateInvites();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedSentTaskInvites = sentTaskInvites.map((taskInvite, index) => {
    return (
      <SentTaskInvitesCard
        key={index}
        name={taskInvite.name}
        surname={taskInvite.surname}
        email={taskInvite.email}
        main_task_invite_uuid={taskInvite.main_task_invite_uuid}
        main_task_title={taskInvite.main_task_title}
        main_task_banner={taskInvite.main_task_banner}
        main_task_priority={taskInvite.main_task_priority}
        removeSentTaskInvites={removeSentTaskInvites}
      />
    );
  });

  const mappedReceivedTaskInvites = receivedTaskInvites.map((taskInvite, index) => {
    return (
      <ReceivedTaskInvitesCard
        key={index}
        name={taskInvite.name}
        surname={taskInvite.surname}
        email={taskInvite.email}
        main_task_invite_uuid={taskInvite.main_task_invite_uuid}
        main_task_title={taskInvite.main_task_title}
        main_task_banner={taskInvite.main_task_banner}
        main_task_priority={taskInvite.main_task_priority}
        updateReceivedTaskInvites={updateReceivedTaskInvites}
      />
    );
  });

  const mappedSentAssociateInvites = sentAssociateInvites.map((associateInvite, index) => {
    return (
      <SentAssociateInvitesCard
        key={index}
        image={associateInvite.image}
        name={associateInvite.name}
        surname={associateInvite.surname}
        email={associateInvite.email}
        removeSentAssociateInvites={removeSentAssociateInvites}
      />
    );
  });

  const mappedReceivedAssociateInvites = receivedAssociateInvites.map((associateInvite, index) => {
    return (
      <ReceivedAssociateInvitesCard
        key={index}
        image={associateInvite.image}
        name={associateInvite.name}
        surname={associateInvite.surname}
        email={associateInvite.email}
        updateReceivedAssociateInvites={updateReceivedAssociateInvites}
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
