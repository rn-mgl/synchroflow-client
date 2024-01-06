import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface InvitesStateProps {
  image: string;
  name: string;
  surname: string;
  email: string;
}

interface TaskInvitesStateProps {
  from_image: string;
  from_name: string;
  from_surname: string;
  from_email: string;
  from_user: string;
  from_user_uuid: string;
  invited_image: string;
  invited_name: string;
  invited_surname: string;
  invited_email: string;
  invited_user: string;
  invited_user_uuid: string;
  main_task_banner: string;
  main_task_title: string;
  main_task_invite_uuid: string;
  main_task_priority: "critical" | "important" | "none";
  main_task_uuid: string;
}

interface AssociateInvitesStateProps extends InvitesStateProps {
  associate_invite_uuid: string;
  user_uuid: string;
}

export default function useInvites() {
  const [sentTaskInvites, setSentTaskInvites] = React.useState<Array<TaskInvitesStateProps>>([
    {
      from_image: "",
      from_name: "",
      from_surname: "",
      from_email: "",
      from_user: "",
      from_user_uuid: "",
      invited_image: "",
      invited_name: "",
      invited_surname: "",
      invited_email: "",
      invited_user: "",
      invited_user_uuid: "",
      main_task_invite_uuid: "",
      main_task_title: "",
      main_task_banner: "",
      main_task_priority: "none",
      main_task_uuid: "",
    },
  ]);
  const [receivedTaskInvites, setReceivedTaskInvites] = React.useState<Array<TaskInvitesStateProps>>([
    {
      from_image: "",
      from_name: "",
      from_surname: "",
      from_email: "",
      from_user: "",
      from_user_uuid: "",
      invited_image: "",
      invited_name: "",
      invited_surname: "",
      invited_email: "",
      invited_user: "",
      invited_user_uuid: "",
      main_task_invite_uuid: "",
      main_task_title: "",
      main_task_banner: "",
      main_task_priority: "none",
      main_task_uuid: "",
    },
  ]);
  const [sentAssociateInvites, setSentAssociateInvites] = React.useState<Array<AssociateInvitesStateProps>>([
    { image: "", name: "", surname: "", email: "", associate_invite_uuid: "", user_uuid: "" },
  ]);
  const [receivedAssociateInvites, setReceivedAssociateInvites] = React.useState<Array<AssociateInvitesStateProps>>([
    { image: "", name: "", surname: "", email: "", associate_invite_uuid: "", user_uuid: "" },
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
