"use client";

import { useGlobalContext } from "@/base/context";
import ReceivedAssociateInvitesCard from "@/components//invites/ReceivedAssociateInvitesCard";
import ReceivedTaskInvitesCard from "@/components//invites/ReceivedTaskInvitesCard";
import SentAssociateInvitesCard from "@/components//invites/SentAssociateInvitesCard";
import SentTaskInvitesCard from "@/components//invites/SentTaskInvitesCard";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface InvitesStateProps {
  image: string;
  name: string;
  surname: string;
  email: string;
}

interface TaskInvitesStateProps extends InvitesStateProps {
  main_task_banner: string;
  main_task_title: string;
  main_task_invite_uuid: string;
  main_task_priority: string;
}

const Invites = () => {
  const [sentTaskInvites, setSentTaskInvites] = React.useState<Array<TaskInvitesStateProps>>([
    {
      image: "",
      name: "",
      surname: "",
      email: "",
      main_task_invite_uuid: "",
      main_task_title: "",
      main_task_banner: "",
      main_task_priority: "",
    },
  ]);
  const [receivedTaskInvites, setReceivedTaskInvites] = React.useState<Array<TaskInvitesStateProps>>([
    {
      image: "",
      name: "",
      surname: "",
      email: "",
      main_task_invite_uuid: "",
      main_task_title: "",
      main_task_banner: "",
      main_task_priority: "",
    },
  ]);
  const [sentAssociateInvites, setSentAssociateInvites] = React.useState<Array<InvitesStateProps>>([
    { image: "", name: "", surname: "", email: "" },
  ]);
  const [receivedAssociateInvites, setReceivedAssociateInvites] = React.useState<Array<InvitesStateProps>>([
    { image: "", name: "", surname: "", email: "" },
  ]);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getSentTaskInvites = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_task_invites`, {
          headers: { Authorization: user?.token },
          params: { type: "sent" },
        });
        if (data) {
          setSentTaskInvites(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const getReceivedTaskInvites = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_task_invites`, {
          headers: { Authorization: user?.token },
          params: { type: "received" },
        });
        if (data) {
          setReceivedTaskInvites(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const getSentAssociateInvites = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/associate_invites`, {
          headers: { Authorization: user?.token },
          params: { type: "sent" },
        });
        if (data) {
          setSentAssociateInvites(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const getReceivedAssociateInvites = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/associate_invites`, {
          headers: { Authorization: user?.token },
          params: { type: "received" },
        });
        if (data) {
          setReceivedAssociateInvites(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

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
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-[26rem]">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Sent Task Invites</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedSentTaskInvites}
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
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedReceivedTaskInvites}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-[26rem]">
            <div className="flex flex-row justify-between w-full">
              <p className="font-semibold">Sent Associate Invites</p>
            </div>

            <div className="relative flex flex-row gap-4 w-full h-full overflow-x-hidden items-center justify-start">
              <div
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedSentAssociateInvites}
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
                className="absolute w-full h-full flex flex-row gap-4 items-center justify-start 
                  transition-all task-scroller p-2 overflow-x-auto cstm-scrollbar"
              >
                {mappedReceivedAssociateInvites}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invites;
