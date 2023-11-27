"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import SubTaskData from "./SubTaskData";

interface CollaboratorsStateProps {
  name: string;
  surname: string;
  image: string;
  user_uuid: string;
  sub_task_collaborator_uuid: string;
  is_sub_task_collaborator: boolean;
}

interface AssignSubTaskProps {
  handleSelectedSubTask: (subTaskUUID: string) => void;
  selectedSubTask: string;
}

const AssignSubTask: React.FC<AssignSubTaskProps> = (props) => {
  const [activePage, setActivePage] = React.useState<"details" | "associates">("details");
  const [collaborators, setCollaborators] = React.useState<Array<CollaboratorsStateProps>>([]);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();

  const handleActivePage = (page: "details" | "associates") => {
    setActivePage(page);
  };

  const assignSubTask = async (collaboratorUUID: string) => {
    try {
      const { data } = await axios.post(
        `${url}/sub_task_collaborators`,
        { subTaskUUID: props.selectedSubTask, collaboratorUUID },
        { headers: { Authorization: user?.token } }
      );
      if (data) {
        props.handleSelectedSubTask(props.selectedSubTask);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const revokeAssignedSubTask = async (collaboratorUUID: string) => {
    try {
      const { data } = await axios.delete(`${url}/sub_task_collaborators/${collaboratorUUID}`, {
        headers: { Authorization: user?.token },
      });
      if (data) {
        props.handleSelectedSubTask(props.selectedSubTask);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleTaskCollborators = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_task_collaborators`, {
          headers: { Authorization: user?.token },
          params: { mainTaskUUID: params?.task_uuid },
        });

        if (data) {
          setCollaborators(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, params?.task_uuid]);

  const mappedCollaborators = collaborators.map((collaborator, index) => {
    return (
      <div key={index} className="flex flex-col gap-2 items-center justify-start w-full">
        <div className="flex flex-row gap-2 items-center justify-start w-full">
          <div
            style={{ backgroundImage: `url(${collaborator.image})` }}
            className="w-8 h-8 min-w-[2rem] min-h-[2rem] bg-primary-200 rounded-full bg-center bg-cover"
          />
          <div className="flex flex-row w-full items-center justify-between text-sm">
            <p className="truncate max-w-[12ch] m-l:max-w-[20ch] t:max-w-none">
              {collaborator.name} {collaborator.surname}
            </p>

            {collaborator.is_sub_task_collaborator ? (
              <button
                onClick={() => revokeAssignedSubTask(collaborator.sub_task_collaborator_uuid)}
                className="flex flex-row gap-2 text-error-500 items-center hover:underline 
                    hover:underline-offset-2 transition-all"
              >
                <AiOutlineMinus /> Revoke
              </button>
            ) : (
              <button
                onClick={() => assignSubTask(collaborator.user_uuid)}
                className="flex flex-row gap-2 text-primary-500 items-center hover:underline 
                    hover:underline-offset-2 transition-all"
              >
                <AiOutlinePlus /> Assign
              </button>
            )}
          </div>
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    getSingleTaskCollborators();
  }, [getSingleTaskCollborators]);

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
        bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
        flex flex-col items-center justify-start p-4 t:p-10"
    >
      <div
        className="w-full bg-white h-fit rounded-lg flex flex-col p-4 t:p-10 gap-4
                  max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={() => props.handleSelectedSubTask(props.selectedSubTask)}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full flex flex-col gap-8 items-center justify-start">
          <div className="flex flex-row w-full justify-between">
            <button
              onClick={() => handleActivePage("details")}
              className={`p-2 text-sm transition-all t:w-28 ${
                activePage === "details" && "border-b-2 border-primary-500 text-primary-500"
              }`}
            >
              Details
            </button>

            <button
              onClick={() => handleActivePage("associates")}
              className={`p-2 text-sm transition-all t:w-28 ${
                activePage === "associates" && "border-b-2 border-primary-500 text-primary-500"
              }`}
            >
              Associates
            </button>
          </div>

          {activePage === "details" ? (
            <SubTaskData selectedSubTask={props.selectedSubTask} />
          ) : (
            <div className="flex flex-col w-full gap-4">{mappedCollaborators}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignSubTask;
