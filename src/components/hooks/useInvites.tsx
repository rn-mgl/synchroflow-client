import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface InvitesStateProps {
  from_image: string;
  from_name: string;
  from_surname: string;
  from_email: string;
  from_user_id: string;
  from_user_uuid: string;
  invited_user_id: string;
  invited_image: string;
  invited_name: string;
  invited_surname: string;
  invited_email: string;
  invited_user_uuid: string;
}

interface TaskInvitesStateProps extends InvitesStateProps {
  main_task_banner: string;
  main_task_title: string;
  main_task_invite_uuid: string;
  main_task_priority: "critical" | "important" | "none";
  main_task_uuid: string;
}

interface AssociateInvitesStateProps extends InvitesStateProps {
  associate_invite_uuid: string;
}

export default function useInvites() {
  const [sentTaskInvites, setSentTaskInvites] = React.useState<Array<TaskInvitesStateProps>>([]);
  const [receivedTaskInvites, setReceivedTaskInvites] = React.useState<Array<TaskInvitesStateProps>>([]);
  const [sentAssociateInvites, setSentAssociateInvites] = React.useState<Array<AssociateInvitesStateProps>>([]);
  const [receivedAssociateInvites, setReceivedAssociateInvites] = React.useState<Array<AssociateInvitesStateProps>>([]);

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

  return {
    sentTaskInvites,
    receivedTaskInvites,
    sentAssociateInvites,
    receivedAssociateInvites,
    getSentTaskInvites,
    getReceivedTaskInvites,
    getSentAssociateInvites,
    getReceivedAssociateInvites,
  };
}
