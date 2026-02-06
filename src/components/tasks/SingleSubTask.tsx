"use client";
import { useGlobalContext } from "@/base/src/contexts/context";
import { localizeDate, localizeTime } from "@/src/utils/dateUtils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import DeleteConfirmation from "../global/DeleteConfirmation";
import EditSubTask from "./EditSubTask";

interface CollaboratorsStateProps {
  name: string;
  surname: string;
  image: string;
  user_uuid: string;
  task_collaborator_uuid: string;
  is_task_collaborator: boolean;
}

interface SubTaskDataStateProps {
  date_created: string;
  task_uuid: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  priority: string;
}

interface SingleSubTaskProps {
  selectedSubTask: string;
  isTaskCreator: boolean;
  handleSelectedSubTask: (subTaskUUID: string) => void;
  getCreatedSubTasks: () => Promise<void>;
}

const SingleSubTask: React.FC<SingleSubTaskProps> = (props) => {
  const [activePage, setActivePage] = React.useState<"details" | "associates">(
    "details",
  );
  const [subTaskData, setSubTaskData] = React.useState<SubTaskDataStateProps>({
    date_created: "",
    task_uuid: "",
    title: "",
    subtitle: "",
    description: "",
    status: "",
    start_date: "",
    end_date: "",
    priority: "",
  });
  const [collaborators, setCollaborators] = React.useState<
    Array<CollaboratorsStateProps>
  >([
    {
      name: "",
      surname: "",
      image: "",
      user_uuid: "",
      task_collaborator_uuid: "",
      is_task_collaborator: false,
    },
  ]);
  const [canEditSubTask, setCanEditSubTask] = React.useState(false);
  const [canDeleteSubTask, setCanDeleteSubTask] = React.useState(false);

  const { socket } = useGlobalContext();
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const params = useParams();
  const url = process.env.NEXT_PUBLIC_API_URL;

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
        `${url}/task_collaborators`,
        { taskUUID: props.selectedSubTask, collaboratorUUID },
        { headers: { Authorization: user?.token } },
      );
      if (data) {
        await getAllTaskCollaborators();
        socket?.emit("assign_sub_task", { room: collaboratorUUID });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const revokeAssignedSubTask = async (
    collaboratorUUID: string,
    collaboratorUserUUID: string,
  ) => {
    try {
      const { data } = await axios.delete(
        `${url}/task_collaborators/${collaboratorUUID}`,
        {
          headers: { Authorization: user?.token },
          params: {
            type: "delete",
          },
        },
      );
      console.log(data);
      if (data) {
        await getAllTaskCollaborators();
        socket?.emit("revoke_sub_task", { room: collaboratorUserUUID });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTaskCollaborators = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/task_collaborators`, {
          headers: { Authorization: user?.token },
          params: {
            subTaskUUID: props.selectedSubTask,
            taskUUID: params?.task_uuid,
            type: "sub",
          },
        });

        if (data) {
          setCollaborators(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user, props.selectedSubTask, params]);

  const getSubtask = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(
          `${url}/tasks/${props.selectedSubTask}`,
          {
            headers: { Authorization: user?.token },
          },
        );
        if (data) {
          setSubTaskData(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [props.selectedSubTask, url, user]);

  const deleteSubtask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/tasks/${subTaskData.task_uuid}`,
        {
          headers: { Authorization: user?.token },
          params: { taskUUID: params?.task_uuid },
        },
      );

      if (data.deleteSubTask) {
        props.handleSelectedSubTask(props.selectedSubTask);
        await props.getCreatedSubTasks();
        toggleCanDeleteSubTask();

        socket?.emit("delete_subtask", { rooms: data.rooms });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedCollaborators = collaborators.map((collaborator, index) => {
    return (
      <div
        key={collaborator.user_uuid}
        className="flex flex-col gap-2 items-center justify-start w-full"
      >
        <div className="flex flex-row gap-2 items-center justify-start w-full">
          <div
            style={{ backgroundImage: `url(${collaborator.image})` }}
            className="w-8 h-8 min-w-[2rem] min-h-[2rem] bg-primary-200 rounded-full bg-center bg-cover"
          />
          <div className="flex flex-row w-full items-center justify-between text-sm">
            <p className="truncate max-w-[12ch] m-l:max-w-[20ch] t:max-w-none">
              {collaborator.name} {collaborator.surname}
            </p>

            {collaborator.is_task_collaborator ? (
              <button
                onClick={() =>
                  revokeAssignedSubTask(
                    collaborator.task_collaborator_uuid,
                    collaborator.user_uuid,
                  )
                }
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
    getAllTaskCollaborators();
  }, [getAllTaskCollaborators]);

  React.useEffect(() => {
    getSubtask();
  }, [getSubtask]);

  React.useEffect(() => {
    const handle = async () => {
      await getAllTaskCollaborators();
    };

    socket?.on("refetch_assigned_subtask", handle);

    return () => {
      socket?.off("refetch_assigned_subtask", handle);
    };
  }, [socket, getAllTaskCollaborators]);

  React.useEffect(() => {
    const handle = async () => {
      await getSubtask();
    };

    socket?.on("reflect_update_subtask", handle);

    return () => {
      socket?.off("reflect_update_subtask", handle);
    };
  }, [socket, getSubtask]);

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
        bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
        flex flex-col items-center justify-start p-4 t:p-10"
    >
      {canDeleteSubTask ? (
        <DeleteConfirmation
          apiRoute={`tasks/${subTaskData.task_uuid}`}
          toggleConfirmation={toggleCanDeleteSubTask}
          refetchData={props.getCreatedSubTasks}
          customDelete={deleteSubtask}
          title="Delete Task"
          message="are you sure you want to delete this task?"
        />
      ) : null}

      {canEditSubTask ? (
        <EditSubTask
          subTaskData={subTaskData}
          getSubTask={getSubtask}
          toggleCanEditSubTask={toggleCanEditSubTask}
          getCreatedSubTasks={props.getCreatedSubTasks}
        />
      ) : null}

      <div
        className="w-full bg-white h-full  rounded-lg flex flex-col t:p-10 my-auto
                  max-w-screen-l-s items-center justify-start"
      >
        <div className="w-full sticky flex flex-col items-center justify-end border-b-[1px] border-b-secondary-200 p-4 t:p-0">
          <button
            onClick={() => props.handleSelectedSubTask(props.selectedSubTask)}
            type="button"
            className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-4"
          >
            <AiOutlineClose className="text-secondary-500" />
          </button>
        </div>

        <div className="w-full h-full flex flex-col gap-8 items-center justify-start overflow-y-auto cstm-scrollbar p-4">
          {props.isTaskCreator ? (
            <div className="flex flex-row w-full justify-between">
              <button
                onClick={() => handleActivePage("details")}
                className={`p-2 text-sm transition-all t:w-28 ${
                  activePage === "details" &&
                  "border-b-2 border-primary-500 text-primary-500"
                }`}
              >
                Details
              </button>

              <button
                onClick={() => handleActivePage("associates")}
                className={`p-2 text-sm transition-all t:w-28 ${
                  activePage === "associates" &&
                  "border-b-2 border-primary-500 text-primary-500"
                }`}
              >
                Associates
              </button>
            </div>
          ) : null}

          {activePage === "details" ? (
            <div className="flex flex-col gap-4 w-full items-center justify-start animate-fadeIn h-full">
              <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
                <p className="text-xs font-light">Title</p>
                <p className="capitalize">{subTaskData.title}</p>
              </div>

              <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
                <p className="text-xs font-light">Sub Title</p>
                <p className="capitalize">{subTaskData.subtitle}</p>
              </div>

              <div className="w-full gap-2 flex flex-col min-h-[10rem] max-h-80 overflow-y-auto cstm-scrollbar-2 border-b-2 border-primary-500 p-2">
                <p className="text-xs font-light">Description</p>
                <p className="capitalize whitespace-pre-wrap break-words">
                  {subTaskData.description}
                </p>
              </div>

              <div className="flex flex-row w-full gap-4 items-center">
                <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
                  <p className="text-xs font-light">Status</p>
                  <p className="capitalize">{subTaskData.status}</p>
                </div>

                <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
                  <p className="text-xs font-light">Priority</p>
                  <p className="capitalize">{subTaskData.priority}</p>
                </div>
              </div>

              <div className="flex flex-col w-full gap-4 items-center t:flex-row">
                <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
                  <p className="text-xs font-light">Start Date</p>
                  <p className="capitalize">
                    {localizeDate(subTaskData.start_date, false)} |{" "}
                    {localizeTime(subTaskData.start_date)}
                  </p>
                </div>

                <div className="w-full gap-2 flex flex-col border-b-2 border-primary-500 p-2">
                  <p className="text-xs font-light">End Date</p>
                  <p className="capitalize">
                    {localizeDate(subTaskData.end_date, false)} |{" "}
                    {localizeTime(subTaskData.end_date)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center justify-center w-full t:flex-row mt-auto">
                {props.isTaskCreator ? (
                  <>
                    <button
                      onClick={toggleCanEditSubTask}
                      className="bg-primary-500 border-2 border-primary-500 rounded-lg text-white 
        font-bold p-2 w-full"
                    >
                      Edit
                    </button>
                    <button
                      onClick={toggleCanDeleteSubTask}
                      className="border-2 border-primary-500 rounded-lg text-primary-500 font-bold p-2 w-full"
                    >
                      Delete
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-4 animate-fadeIn">
              {mappedCollaborators}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleSubTask;
