"use client";

import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface AssociateProps {
  associateUUID: string;
  handleSelectedAssociate: () => void;
}

interface AssociateDataStateProps {
  name: string;
  surname: string;
  email: string;
  image: string;
  status: string;
  role: string;
  tasks: number;
  rating: number;
}

const AssociateDetails: React.FC<AssociateProps> = (props) => {
  const [associateData, setAssociateData] = React.useState({
    name: "",
    surname: "",
    email: "",
    image: "",
    status: "",
    role: "",
    tasks: "",
    rating: "",
  });

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getAssociate = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(
          `${url}/associates/${props.associateUUID}`,
          {
            headers: { Authorization: user?.token },
          },
        );
        if (data) {
          setAssociateData(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, props.associateUUID, user]);

  React.useEffect(() => {
    getAssociate();
  }, [getAssociate]);

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
            bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
            flex flex-col items-center justify-start p-4 t:p-10"
    >
      <div
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4
                  max-w-screen-l-s overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.handleSelectedAssociate}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full flex flex-col gap-4">
          <div
            className="w-full rounded-md h-20 bg-gradient-to-br from-primary-500 to-primary-200 
                    relative flex flex-col items-center t:h-32"
          >
            <div
              style={{ backgroundImage: `url(${associateData.image})` }}
              className="w-16 min-w-[4rem] h-16 min-h-[4rem] rounded-full bg-secondary-100 bg-center 
                        bg-cover border-4 border-white absolute bottom-0 translate-y-8
                        t:w-24 t:h-24 t:min-w-[6rem] t:min-h-[6rem] t:translate-y-11"
            />
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-2 text-center mt-8">
            <p className="text-xl font-semibold">
              {associateData.name} {associateData.surname}
            </p>
            <p className="text-sm">{associateData.email}</p>
          </div>

          <div className="w-full rounded-md p-4 bg-neutral-100 t:w-6/12">
            <p className="text-sm italic">&quot;{associateData.status}&quot;</p>
          </div>

          <p className="text-sm">{associateData.rating}</p>
        </div>
      </div>
    </div>
  );
};

export default AssociateDetails;
