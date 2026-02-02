import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface InvitesStateProps {
  from_image: string;
  from_name: string;
  from_surname: string;
  from_email: string;
  from_user: string;
  from_user_uuid: string;
  invited_user_id: string;
  invited_image: string;
  invited_name: string;
  invited_surname: string;
  invited_email: string;
  invited_user_uuid: string;
}

interface TaskInvitesStateProps extends InvitesStateProps {
  banner: string;
  title: string;
  task_invite_uuid: string;
  priority: "critical" | "important" | "none";
  task_uuid: string;
  message: string;
}

interface AssociateInvitesStateProps extends InvitesStateProps {
  associate_invite_uuid: string;
}

export default function useInvites() {
  const [sentTaskInvites, setSentTaskInvites] = React.useState<
    Array<TaskInvitesStateProps>
  >([]);
  const [receivedTaskInvites, setReceivedTaskInvites] = React.useState<
    Array<TaskInvitesStateProps>
  >([]);
  const [sentAssociateInvites, setSentAssociateInvites] = React.useState<
    Array<AssociateInvitesStateProps>
  >([]);
  const [receivedAssociateInvites, setReceivedAssociateInvites] =
    React.useState<Array<AssociateInvitesStateProps>>([]);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getSentTaskInvites = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/task_invites`, {
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
  }, [url, user]);

  const getReceivedTaskInvites = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/task_invites`, {
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
  }, [url, user]);

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
  }, [url, user]);

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
  }, [url, user]);

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
