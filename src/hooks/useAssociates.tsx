import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AssociatesProps } from "../interface/Associates";

export default function useAssociates() {
  const [recentAssociates, setRecentAssociates] = React.useState<
    Array<AssociatesProps>
  >([]);
  const [allAssociates, setAllAssociates] = React.useState<
    Array<AssociatesProps>
  >([]);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
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
  }, [url, user]);

  const getRecentAssociates = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/associates`, {
          headers: { Authorization: user?.token },
          params: {
            type: "recent",
          },
        });
        if (data) {
          setRecentAssociates(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user]);

  return {
    allAssociates,
    recentAssociates,
    getAllAssociates,
    getRecentAssociates,
  };
}
