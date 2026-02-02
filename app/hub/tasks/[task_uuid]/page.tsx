"use client";
import { useGlobalContext } from "@/base/src/contexts/context";
import DeleteConfirmation from "@/components/global/DeleteConfirmation";
import SendTaskInvite from "@/components/invites/SendTaskInvite";
import AsssignedSubTasks from "@/components/tasks/AsssignedSubTasks";
import CreateSubTask from "@/components/tasks/CreateSubTask";
import CreatedSubTasks from "@/components/tasks/CreatedSubTasks";
import EditTask from "@/components/tasks/EditTask";
import SingleSubTask from "@/components/tasks/SingleSubTask";
import { localizeDate } from "@/src/utils/dateUtils";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {
  AiOutlineClockCircle,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEllipsis,
  AiOutlinePlus,
  AiOutlineUser,
} from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

interface SingleTaskDataStateProps {
  banner: string | null;
  task_by: number;
  description: string;
  priority: string;
  start_date: string;
  end_date: string;
  status: string;
  subtitle: string;
  title: string;
  task_uuid: string;
}

interface SubTasksStateProps {
  title: string;
  subtitle: string;
  task_uuid: string;
}

interface CollaboratorsStateProps {
  name: string;
  surname: string;
  image: string;
  task_collaborator_uuid: string;
  user_uuid: string;
}

const SingleTask = () => {
  const [taskData, setTaskData] = React.useState<SingleTaskDataStateProps>({
    banner: "",
    task_by: -1,
    description: "",
    priority: "",
    start_date: "",
    end_date: "",
    status: "",
    subtitle: "",
    title: "",
    task_uuid: "",
  });
  const [collaborators, setCollaborators] = React.useState<
    Array<CollaboratorsStateProps>
  >([]);
  const [createdSubTasks, setCreatedSubTasks] = React.useState<
    Array<SubTasksStateProps>
  >([]);
  const [assignedSubTasks, setAssignedSubTasks] = React.useState<
    Array<SubTasksStateProps>
  >([]);
  const [selectedSubTask, setSelectedSubTask] = React.useState("");
  const [canInvite, setCanInvite] = React.useState(false);
  const [canCreateSubTask, setCanCreateSubTask] = React.useState(false);
  const [canDeleteTask, setCanDeleteTask] = React.useState(false);
  const [canEditTask, setCanEditTask] = React.useState(false);
  const [activeToolTip, setActiveToolTip] = React.useState(false);
  const [canLeaveTask, setCanLeaveTask] = React.useState(false);
  const [collaboratorToRemove, setCollaboratorToRemove] = React.useState("");

  const params = useParams();
  const { socket } = useGlobalContext();
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const isTaskCreator = user?.id === taskData.task_by;
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL;

  const toggleCanInvite = () => {
    setCanInvite((prev) => !prev);
  };

  const toggleCanCreateSubTask = () => {
    setCanCreateSubTask((prev) => !prev);
  };

  const toggleCanDeleteTask = () => {
    setCanDeleteTask((prev) => !prev);
  };

  const toggleCanEditTask = () => {
    setCanEditTask((prev) => !prev);
  };

  const toggleActiveToolTip = () => {
    setActiveToolTip((prev) => !prev);
  };

  const toggleCanLeaveTask = () => {
    setCanLeaveTask((prev) => !prev);
  };

  const handleCollaboratorToRemove = (collaboratorUUID: string) => {
    setCollaboratorToRemove((prev) =>
      prev === collaboratorUUID ? "" : collaboratorUUID,
    );
  };

  const handleSelectedSubTask = (subTaskUUID: string) => {
    setSelectedSubTask((prev) => (prev === subTaskUUID ? "" : subTaskUUID));
  };

  const getSingleTask = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/tasks/${params?.task_uuid}`, {
          headers: { Authorization: user?.token },
        });

        if (data) {
          setTaskData(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user, params]);

  const getSingleTaskCollborators = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/task_collaborators`, {
          headers: { Authorization: user?.token },
          params: { taskUUID: params?.task_uuid },
        });

        if (data) {
          setCollaborators(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user, params]);

  const getCreatedSubTasks = React.useCallback(async () => {
    if (isTaskCreator && user?.token) {
      try {
        const { data } = await axios.get(`${url}/tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "main task", taskUUID: params?.task_uuid },
        });
        if (data) {
          setCreatedSubTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user, params, isTaskCreator]);

  const getAssignedSubTasks = React.useCallback(async () => {
    if (!isTaskCreator && user?.token) {
      try {
        const { data } = await axios.get(`${url}/tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "collaborated", taskUUID: params?.task_uuid },
        });
        if (data) {
          setAssignedSubTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user, isTaskCreator, params]);

  const deleteTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(`${url}/tasks/${params?.task_uuid}`, {
        headers: { Authorization: user?.token },
      });

      if (data.deleteTask) {
        toggleCanDeleteTask();
        router.push("/hub/tasks");
        socket?.emit("delete_task", {
          taskUUID: params?.task_uuid,
          rooms: data.rooms,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const leaveTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/task_collaborators/${params?.task_uuid}`,
        {
          headers: { Authorization: user?.token },
          params: { type: "leave", taskUUID: params?.task_uuid },
        },
      );

      if (data.deleteCollaborator) {
        toggleCanLeaveTask();
        router.push("/hub/tasks");
        socket?.emit("leave_task", {
          taskUUID: params?.task_uuid,
          rooms: data.rooms,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeCollaborator = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/task_collaborators/${collaboratorToRemove}`,
        {
          headers: { Authorization: user?.token },
          params: { type: "delete", taskUUID: params?.task_uuid },
        },
      );

      if (data.deleteCollaborator) {
        handleCollaboratorToRemove("");
        await getSingleTaskCollborators();
        socket?.emit("remove_collaborator", {
          taskUUID: params?.task_uuid,
          rooms: data.rooms,
        });
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
          <div className="flex flex-row w-full items-center justify-between">
            <p className="max-w-[20ch] truncate">
              {collaborator.name} {collaborator.surname}
            </p>

            {isTaskCreator && (
              <button
                onClick={() =>
                  setCollaboratorToRemove(collaborator.task_collaborator_uuid)
                }
                className="p-2 rounded-full hover:bg-primary-500  
                        text-primary-500 hover:text-white transition-all"
              >
                <AiOutlineDelete />
              </button>
            )}
          </div>
        </div>
        {index !== collaborators.length - 1 ? (
          <div className="w-full h-[1px] bg-secondary-200" />
        ) : null}
      </div>
    );
  });

  React.useEffect(() => {
    getSingleTask();
  }, [getSingleTask]);

  React.useEffect(() => {
    getSingleTaskCollborators();
  }, [getSingleTaskCollborators]);

  React.useEffect(() => {
    const handle = async (args: { taskUUID: string }) => {
      if (params?.task_uuid === args.taskUUID) {
        await getSingleTaskCollborators();
      }
    };

    socket?.on("refetch_tasks_collaborators", handle);

    return () => {
      socket?.off("refetch_tasks_collaborators", handle);
    };
  }, [socket, params?.task_uuid, getSingleTaskCollborators]);

  React.useEffect(() => {
    const handle = async () => {
      await getSingleTask();
    };

    socket?.on("reflect_update_task", handle);

    return () => {
      socket?.off("reflect_update_task", handle);
    };
  }, [socket, getSingleTask]);

  React.useEffect(() => {
    const handle = async () => {
      await getAssignedSubTasks();
    };

    socket?.on("refetch_assigned_subtask", handle);

    return () => {
      socket?.off("refetch_assigned_subtask", handle);
    };
  }, [socket, getAssignedSubTasks]);

  React.useEffect(() => {
    const handle = async () => {
      await getAssignedSubTasks();
    };

    socket?.on("reflect_update_subtask", handle);

    return () => {
      socket?.off("reflect_update_subtask", handle);
    };
  }, [socket, getAssignedSubTasks]);

  React.useEffect(() => {
    const handle = async () => {
      await getAssignedSubTasks();
      handleSelectedSubTask("");
    };

    socket?.on("reflect_delete_subtask", handle);

    return () => {
      socket?.off("reflect_delete_subtask", handle);
    };
  }, [socket, getAssignedSubTasks]);

  React.useEffect(() => {
    const handle = async (args: { taskUUID: string }) => {
      if (args.taskUUID === params?.task_uuid) {
        router.push("/hub/tasks");
      }
    };

    socket?.on("reflect_delete_task", handle);

    return () => {
      socket?.off("reflect_delete_task", handle);
    };
  }, [socket, params?.task_uuid, router]);

  React.useEffect(() => {
    const handle = async (args: { taskUUID: string }) => {
      if (args.taskUUID === params?.task_uuid) {
        router.push("/hub/tasks");
      }
    };

    socket?.on("reflect_remove_collaborator", handle);

    return () => {
      socket?.off("reflect_remove_collaborator", handle);
    };
  }, [socket, params?.task_uuid, router]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
            items-center w-full h-full"
      >
        {canInvite ? (
          <SendTaskInvite
            taskUUID={taskData.task_uuid}
            toggleCanInvite={toggleCanInvite}
          />
        ) : null}

        {canCreateSubTask ? (
          <CreateSubTask
            toggleCanCreateSubTask={toggleCanCreateSubTask}
            getCreatedSubTasks={getCreatedSubTasks}
          />
        ) : null}

        {selectedSubTask ? (
          <SingleSubTask
            isTaskCreator={isTaskCreator}
            selectedSubTask={selectedSubTask}
            handleSelectedSubTask={handleSelectedSubTask}
            getCreatedSubTasks={getCreatedSubTasks}
          />
        ) : null}

        {canDeleteTask ? (
          <DeleteConfirmation
            apiRoute={`tasks/${params?.task_uuid}`}
            toggleConfirmation={toggleCanDeleteTask}
            customDelete={deleteTask}
            redirectLink="/hub/tasks"
            title="Delete Task"
            message="are you sure you want to delete this task?"
          />
        ) : null}

        {canLeaveTask ? (
          <DeleteConfirmation
            apiRoute={`task_collaborators/${params?.task_uuid}`}
            toggleConfirmation={toggleCanLeaveTask}
            customDelete={leaveTask}
            redirectLink="/hub/tasks"
            title="Leave Task"
            message="are you sure you want to leave this task?"
          />
        ) : null}

        {collaboratorToRemove ? (
          <DeleteConfirmation
            apiRoute={`task_collaborators/${params?.task_uuid}`}
            toggleConfirmation={() =>
              handleCollaboratorToRemove(collaboratorToRemove)
            }
            customDelete={removeCollaborator}
            redirectLink="/hub/tasks"
            title="Leave Task"
            message="are you sure you want to leave this task?"
          />
        ) : null}

        {canEditTask ? (
          <EditTask
            taskData={taskData}
            toggleCanEditTask={toggleCanEditTask}
            getSingleTask={getSingleTask}
          />
        ) : null}

        <div className="flex flex-col p-4 items-center justify-start w-full h-auto l-s:h-full t:p-10 gap-4 l-s:overflow-hidden">
          <Link
            href="/hub/tasks"
            className="mr-auto hover:bg-secondary-500 transition-all
                      hover:bg-opacity-10 p-2 rounded-full pt-0"
          >
            <BsArrowLeft className="text-lg" />
          </Link>

          <div className="grid grid-cols-1 items-center justify-start w-full h-auto l-s:h-full gap-8 l-s:grid-cols-3 l-s:overflow-hidden">
            <div className="flex flex-col items-center justify-start w-full h-auto l-s:h-full gap-8 col-span-1 l-s:col-span-2 l-s:overflow-hidden">
              <div className="flex flex-col gap-2 w-full items-start justify-start">
                <div className="flex flex-row w-full justify-between items-center">
                  <p className="text-2xl font-medium text-secondary-500">
                    {taskData.title}
                  </p>

                  <div className="relative flex self-end ">
                    <button
                      onClick={toggleActiveToolTip}
                      className="hover:bg-secondary-100 p-2 
                      rounded-full transition-all"
                    >
                      {activeToolTip ? (
                        <AiOutlineClose />
                      ) : (
                        <AiOutlineEllipsis className="text-lg" />
                      )}
                    </button>

                    {activeToolTip ? (
                      <div
                        className="w-40 absolute animate-fadeIn flex flex-col items-start justify-center gap-2 
                                -translate-x-full bg-secondary-300 p-1 rounded-lg transition-all delay-200 
                                font-medium shadow-lg text-white text-xs"
                      >
                        {isTaskCreator ? (
                          <>
                            <button
                              onClick={toggleCanEditTask}
                              className="flex flex-row w-full items-center gap-2 hover:bg-secondary-400 p-2 rounded-md transition-all"
                            >
                              <AiOutlineEdit />
                              Edit
                            </button>
                            <div className=" w-full min-h-[1px] h-[1px] bg-secondary-400" />
                            <button
                              onClick={toggleCanDeleteTask}
                              className="flex flex-row w-full items-center gap-2 hover:bg-secondary-400 p-2 rounded-md transition-all"
                            >
                              <AiOutlineDelete />
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={toggleCanLeaveTask}
                              className="flex flex-row w-full items-center gap-2 hover:bg-secondary-400 p-2 rounded-md transition-all"
                            >
                              <AiOutlineEdit />
                              Leave
                            </button>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div
                  style={{
                    backgroundImage: `url(${taskData.banner})`,
                  }}
                  className="w-full rounded-2xl h-48 bg-primary-300 bg-center  bg-cover l-s:h-56 p-4 flex flex-col"
                />

                <div className="flex flex-row gap-2 text-secondary-400 text-sm">
                  <p>{taskData.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-start justify-start w-full">
                <div className="flex flex-row gap-2 text-sm">
                  <div className="flex flex-row items-center justify-center gap-1">
                    <div>
                      <AiOutlineUser className="text-lg text-secondary-400" />
                    </div>
                    {collaborators.length}{" "}
                    {collaborators.length > 1
                      ? "Collaborators"
                      : "Collaborator"}
                  </div>
                  {isTaskCreator ? (
                    <>
                      |
                      <button
                        onClick={toggleCanInvite}
                        className="text-primary-500 flex flex-row items-center justify-center gap-1 hover:underline underline-offset-2"
                      >
                        <AiOutlinePlus className="text-xs" />
                        Invite
                      </button>
                    </>
                  ) : null}
                </div>

                <div className="flex flex-row gap-2 items-center text-sm">
                  <div>
                    <AiOutlineClockCircle className="text-lg text-secondary-400" />
                  </div>
                  <p>
                    {localizeDate(taskData.start_date, true)} -{" "}
                    {localizeDate(taskData.end_date, true)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500 h-full overflow-y-hidden">
                <p className="text-xl font-medium ">Description</p>

                <div
                  className="flex flex-col w-full rounded-md overflow-y-auto max-h-[16rem] h-[16rem] l-s:h-full l-s:max-h-none bg-neutral-150 p-2 cstm-scrollbar
                            l-s:p-4"
                >
                  <p className="leading-relaxed text-xs">
                    {taskData.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start w-full h-auto gap-8 col-span-1 l-s:h-full overflow-hidden">
              <div
                className="flex flex-col items-center justify-start w-full gap-2 col-span-1 min-h-[20rem] max-h-[20rem] h-80 overflow-y-auto
                          l-s:max-h-none l-s:h-full"
              >
                <div className="flex flex-row w-full items-center justify-between">
                  <p className="text-xl font-medium mr-auto">
                    {isTaskCreator ? "Created Sub Tasks" : "Your Sub Tasks"}
                  </p>

                  {isTaskCreator ? (
                    <button
                      onClick={toggleCanCreateSubTask}
                      className="flex flex-row gap-1 items-center text-xs text-primary-500
                      hover:underline hover:underline-offset-2 whitespace-nowrap"
                    >
                      <AiOutlinePlus /> Sub Task
                    </button>
                  ) : null}
                </div>

                {isTaskCreator ? (
                  <CreatedSubTasks
                    getCreatedSubTasks={getCreatedSubTasks}
                    handleSelectedSubTask={handleSelectedSubTask}
                    createdSubTasks={createdSubTasks}
                  />
                ) : (
                  <AsssignedSubTasks
                    getAssignedSubTasks={getAssignedSubTasks}
                    handleSelectedSubTask={handleSelectedSubTask}
                    assignedSubTasks={assignedSubTasks}
                  />
                )}
              </div>

              <div
                className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500 min-h-[20rem] max-h-[20rem] h-80 
                          l-s:max-h-none l-s:h-full"
              >
                <p className="font-medium text-xl">
                  {collaborators.length > 1 ? "Collaborators" : "Collaborator"}
                </p>

                <div className="flex flex-col gap-2 w-full bg-neutral-150 overflow-y-auto h-full rounded-md p-2">
                  {mappedCollaborators}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTask;
