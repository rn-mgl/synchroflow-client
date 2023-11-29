import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

interface AssociatesProps {
  name: string;
  surname: string;
  email: string;
  associate_uuid: string;
  image: string;
  status: string;
  role: string;
}

export default function useAssociates() {
  const [recentAssociates, setRecentAssociates] = React.useState<Array<AssociatesProps>>([
    { name: "", surname: "", email: "", associate_uuid: "", image: "", status: "", role: "" },
  ]);
  const [allAssociates, setAllAssociates] = React.useState<Array<AssociatesProps>>([
    { name: "", surname: "", email: "", associate_uuid: "", image: "", status: "", role: "" },
  ]);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const getAllAssociates = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/associates`, {
          headers: { Authorization: user?.token },
          params: { type: "all" },
        });
        if (data) {
          setAllAssociates(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const getRecentAssociates = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/associates`, {
          headers: { Authorization: user?.token },
          params: { type: "recent" },
        });
        if (data) {
          setRecentAssociates(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  return {
    allAssociates,
    recentAssociates,
    getAllAssociates,
    getRecentAssociates,
  };
}
