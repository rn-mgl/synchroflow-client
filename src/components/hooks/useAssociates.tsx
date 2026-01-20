import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

export interface AssociatesProps {
  of_uuid: string;
  of_name: string;
  of_surname: string;
  of_email: string;
  of_image: string;
  of_status: string;
  of_role: string;
  is_uuid: string;
  is_name: string;
  is_surname: string;
  is_email: string;
  is_image: string;
  is_status: string;
  is_role: string;
  associate_uuid: string;
  associate_of: number;
  associate_is: number;
}

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

  const getAllAssociates = React.useCallback(
    async (
      sortFilter: string,
      searchFilter: string,
      searchCategory: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/associates`, {
            headers: { Authorization: user?.token },
            params: { type: "all", sortFilter, searchFilter, searchCategory },
          });
          if (data) {
            setAllAssociates(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user?.token],
  );

  const getRecentAssociates = React.useCallback(
    async (
      sortFilter: string,
      searchFilter: string,
      searchCategory: string,
    ) => {
      if (user?.token) {
        try {
          const { data } = await axios.get(`${url}/associates`, {
            headers: { Authorization: user?.token },
            params: {
              type: "recent",
              sortFilter,
              searchFilter,
              searchCategory,
            },
          });
          if (data) {
            setRecentAssociates(data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [url, user?.token],
  );

  return {
    allAssociates,
    recentAssociates,
    getAllAssociates,
    getRecentAssociates,
  };
}
