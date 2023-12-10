"use client";

import { useGlobalContext } from "@/base/context";
import ReceivedAssociateInvitesCard from "@/components//invites/ReceivedAssociateInvitesCard";
import ReceivedTaskInvitesCard from "@/components//invites/ReceivedTaskInvitesCard";
import SentAssociateInvitesCard from "@/components//invites/SentAssociateInvitesCard";
import SentTaskInvitesCard from "@/components//invites/SentTaskInvitesCard";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Invites = () => {
  const [sentTaskInvites, setSentTaskInvites] = React.useState([]);
  const [receivedTaskInvites, setReceivedTaskInvites] = React.useState([]);
  const [sentAssociateInvites, setSentAssociateInvites] = React.useState([]);
  const [receivedAssociateInvites, setReceivedAssociateInvites] = React.useState([]);

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

  const mappedSentTaskInvites = receivedAssociateInvites.map((associateInvite, index) => {
    return <SentTaskInvitesCard key={index} />;
  });

  const mappedReceivedTaskInvites = receivedAssociateInvites.map((associateInvite, index) => {
    return <ReceivedTaskInvitesCard key={index} />;
  });

  const mappedSentAssociateInvites = receivedAssociateInvites.map((associateInvite, index) => {
    return <SentAssociateInvitesCard key={index} />;
  });

  const mappedReceivedAssociateInvites = receivedAssociateInvites.map((associateInvite, index) => {
    return <ReceivedAssociateInvitesCard key={index} />;
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
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-[17rem]">
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
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-[17rem] ">
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
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-[17rem]">
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
          <div className="w-full flex flex-col gap-2 rounded-lg items-center h-[17rem]">
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
