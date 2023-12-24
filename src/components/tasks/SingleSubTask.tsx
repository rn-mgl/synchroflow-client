"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import SubTaskData from "./SubTaskData";
import DeleteConfirmation from "../global/DeleteConfirmation";
import EditSubTask from "./EditSubTask";

interface CollaboratorsStateProps {
  name: string;
  surname: string;
  image: string;
  user_uuid: string;
  sub_task_collaborator_uuid: string;
  is_sub_task_collaborator: boolean;
}

interface SubTaskDataStateProps {
  date_created: string;
  sub_task_uuid: string;
  sub_task_title: string;
  sub_task_subtitle: string;
  sub_task_description: string;
  sub_task_status: string;
  sub_task_start_date: string;
  sub_task_end_date: string;
  sub_task_priority: string;
}

interface SingleSubTaskProps {
  selectedSubTask: string;
  handleSelectedSubTask: (subTaskUUID: string) => void;
  getCreatedSubTasks: () => Promise<void>;
}

const SingleSubTask: React.FC<SingleSubTaskProps> = (props) => {
  const [activePage, setActivePage] = React.useState<"details" | "associates">("details");
  const [subTaskData, setSubTaskData] = React.useState<SubTaskDataStateProps>({
    date_created: "",
    sub_task_uuid: "",
    sub_task_title: "",
    sub_task_subtitle: "",
    sub_task_description: "",
    sub_task_status: "",
    sub_task_start_date: "",
    sub_task_end_date: "",
    sub_task_priority: "",
  });
  const [collaborators, setCollaborators] = React.useState<Array<CollaboratorsStateProps>>([
    {
      name: "",
      surname: "",
      image: "",
      user_uuid: "",
      sub_task_collaborator_uuid: "",
      is_sub_task_collaborator: false,
    },
  ]);
  const [canEditSubTask, setCanEditSubTask] = React.useState(false);
  const [canDeleteSubTask, setCanDeleteSubTask] = React.useState(false);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();

  const handleActivePage = (page: "details" | "associates") => {
    setActivePage(page);
  };

  const toggleCanEditSubTask = () => {
    setCanEditSubTask((prev) => !prev);
  };

  const toggleCanDeleteSubTask = () => {
    setCanDeleteSubTask((prev) => !prev);
  };

  const assignSubTask = async (collaboratorUUID: string) => {
    try {
      const { data } = await axios.post(
        `${url}/sub_task_collaborators`,
        { subTaskUUID: props.selectedSubTask, collaboratorUUID },
        { headers: { Authorization: user?.token } }
      );
      if (data) {
        await getAllSubTaskCollaborators();
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
        await getAllSubTaskCollaborators();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllSubTaskCollaborators = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/sub_task_collaborators`, {
          headers: { Authorization: user?.token },
          params: { subTaskUUID: props.selectedSubTask, mainTaskUUID: params?.task_uuid },
        });

        if (data) {
          setCollaborators(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, props.selectedSubTask, params?.task_uuid]);

  const getSubtask = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/sub_tasks/${props.selectedSubTask}`, {
          headers: { Authorization: user?.token },
        });
        if (data) {
          setSubTaskData(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [props.selectedSubTask, url, user?.token]);

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
    getAllSubTaskCollaborators();
  }, [getAllSubTaskCollaborators]);

  React.useEffect(() => {
    getSubtask();
  }, [getSubtask]);

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
        bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
        flex flex-col items-center justify-start p-4 t:p-10"
    >
      {canDeleteSubTask ? (
        <DeleteConfirmation
          apiRoute={`sub_tasks/${subTaskData.sub_task_uuid}`}
          toggleConfirmation={() => {
            toggleCanDeleteSubTask();
            props.handleSelectedSubTask(props.selectedSubTask);
          }}
          refetchData={props.getCreatedSubTasks}
          title="Delete Task"
          message="are you sure you want to delete this task?"
        />
      ) : null}

      {canEditSubTask ? (
        <EditSubTask subTaskData={subTaskData} getSubTask={getSubtask} toggleCanEditSubTask={toggleCanEditSubTask} />
      ) : null}

      <div
        className="w-full bg-white h-full  rounded-lg flex flex-col t:p-10 gap-4 my-auto
                  max-w-screen-t items-center justify-start"
      >
        <div className="w-full sticky flex flex-col items-center justify-end border-b-[1px] border-b-secondary-200 p-4">
          <button
            onClick={() => props.handleSelectedSubTask(props.selectedSubTask)}
            type="button"
            className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
          >
            <AiOutlineClose className="text-secondary-500" />
          </button>
        </div>

        <div className="w-full h-fit flex flex-col gap-8 items-center justify-start overflow-y-auto cstm-scrollbar p-4">
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
            <SubTaskData
              selectedSubTask={props.selectedSubTask}
              date_created={subTaskData.date_created}
              sub_task_title={subTaskData.sub_task_title}
              sub_task_subtitle={subTaskData.sub_task_subtitle}
              sub_task_description={subTaskData.sub_task_description}
              sub_task_status={subTaskData.sub_task_status}
              sub_task_start_date={subTaskData.sub_task_start_date}
              sub_task_end_date={subTaskData.sub_task_end_date}
              sub_task_priority={subTaskData.sub_task_priority}
              toggleCanDeleteSubTask={toggleCanDeleteSubTask}
              toggleCanEditSubTask={toggleCanEditSubTask}
            />
          ) : (
            <div className="flex flex-col w-full gap-4 animate-fadeIn">{mappedCollaborators}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleSubTask;
