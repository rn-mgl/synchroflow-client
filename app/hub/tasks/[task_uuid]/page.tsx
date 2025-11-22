"use client";
import { useGlobalContext } from "@/base/context";
import DeleteConfirmation from "@/components/global/DeleteConfirmation";
import SendTaskInvite from "@/components/invites/SendTaskInvite";
import AsssignedSubTasks from "@/components/tasks/AsssignedSubTasks";
import CreateSubTask from "@/components/tasks/CreateSubTask";
import CreatedSubTasks from "@/components/tasks/CreatedSubTasks";
import EditTask from "@/components/tasks/EditTask";
import SingleSubTask from "@/components/tasks/SingleSubTask";
import SingleTaskMainData from "@/components/tasks/SingleTaskMainData";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

interface SingleTaskDataStateProps {
  main_task_banner: string | null;
  main_task_by: number;
  main_task_description: string;
  main_task_priority: string;
  main_task_start_date: string;
  main_task_end_date: string;
  main_task_status: string;
  main_task_subtitle: string;
  main_task_title: string;
  main_task_uuid: string;
}

interface SubTasksStateProps {
  sub_task_title: string;
  sub_task_subtitle: string;
  sub_task_uuid: string;
}

interface CollaboratorsStateProps {
  name: string;
  surname: string;
  image: string;
  main_task_collaborator_uuid: string;
  user_uuid: string;
}

const SingleTask = () => {
  const [taskData, setTaskData] = React.useState<SingleTaskDataStateProps>({
    main_task_banner: "",
    main_task_by: -1,
    main_task_description: "",
    main_task_priority: "",
    main_task_start_date: "",
    main_task_end_date: "",
    main_task_status: "",
    main_task_subtitle: "",
    main_task_title: "",
    main_task_uuid: "",
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
  const { data: session } = useSession();
  const user = session?.user;
  const isTaskCreator = parseInt(user?.id) === taskData.main_task_by;
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
      prev === collaboratorUUID ? "" : collaboratorUUID
    );
  };

  const handleSelectedSubTask = (subTaskUUID: string) => {
    setSelectedSubTask((prev) => (prev === subTaskUUID ? "" : subTaskUUID));
  };

  const getSingleTask = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(
          `${url}/main_tasks/${params?.task_uuid}`,
          {
            headers: { Authorization: user?.token },
          }
        );

        if (data) {
          setTaskData(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, params?.task_uuid]);

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

  const getCreatedSubTasks = React.useCallback(async () => {
    if (isTaskCreator && user?.token) {
      try {
        const { data } = await axios.get(`${url}/sub_tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "main task", mainTaskUUID: params?.task_uuid },
        });
        if (data) {
          setCreatedSubTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, params?.task_uuid, isTaskCreator]);

  const getAssignedSubTasks = React.useCallback(async () => {
    if (!isTaskCreator && user?.token) {
      try {
        const { data } = await axios.get(`${url}/sub_tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "collaborated", mainTaskUUID: params?.task_uuid },
        });
        if (data) {
          setAssignedSubTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, isTaskCreator, params?.task_uuid]);

  const deleteTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/main_tasks/${params?.task_uuid}`,
        {
          headers: { Authorization: user?.token },
        }
      );

      if (data.deleteTask) {
        toggleCanDeleteTask();
        router.push("/hub/tasks");
        socket?.emit("delete_task", {
          mainTaskUUID: params?.task_uuid,
          rooms: data.rooms,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const leaveTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/main_task_collaborators/${params?.task_uuid}`,
        {
          headers: { Authorization: user?.token },
          params: { type: "leave", mainTaskUUID: params?.task_uuid },
        }
      );

      if (data.deleteCollaborator) {
        toggleCanLeaveTask();
        router.push("/hub/tasks");
        socket?.emit("leave_task", {
          mainTaskUUID: params?.task_uuid,
          rooms: data.rooms,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeCollaborator = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${url}/main_task_collaborators/${collaboratorToRemove}`,
        {
          headers: { Authorization: user?.token },
          params: { type: "delete", mainTaskUUID: params?.task_uuid },
        }
      );

      if (data.deleteCollaborator) {
        handleCollaboratorToRemove("");
        await getSingleTaskCollborators();
        socket?.emit("remove_collaborator", {
          mainTaskUUID: params?.task_uuid,
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
        key={index}
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
                  setCollaboratorToRemove(
                    collaborator.main_task_collaborator_uuid
                  )
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
    const handle = async (args: { mainTaskUUID: string }) => {
      if (params?.task_uuid === args.mainTaskUUID) {
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
    const handle = async (args: { mainTaskUUID: string }) => {
      if (args.mainTaskUUID === params?.task_uuid) {
        router.push("/hub/tasks");
      }
    };

    socket?.on("reflect_delete_task", handle);

    return () => {
      socket?.off("reflect_delete_task", handle);
    };
  }, [socket, params?.task_uuid, router]);

  React.useEffect(() => {
    const handle = async (args: { mainTaskUUID: string }) => {
      if (args.mainTaskUUID === params?.task_uuid) {
        router.push("/hub/tasks");
      }
    };

    socket?.on("reflect_remove_collaborator", handle);

    return () => {
      socket?.off("reflect_remove_collaborator", handle);
    };
  }, [socket, params?.task_uuid, router]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
            items-center w-full h-full"
      >
        {canInvite ? (
          <SendTaskInvite
            taskUUID={taskData.main_task_uuid}
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
            apiRoute={`main_tasks/${params?.task_uuid}`}
            toggleConfirmation={toggleCanDeleteTask}
            customDelete={deleteTask}
            redirectLink="/hub/tasks"
            title="Delete Task"
            message="are you sure you want to delete this task?"
          />
        ) : null}

        {canLeaveTask ? (
          <DeleteConfirmation
            apiRoute={`main_task_collaborators/${params?.task_uuid}`}
            toggleConfirmation={toggleCanLeaveTask}
            customDelete={leaveTask}
            redirectLink="/hub/tasks"
            title="Leave Task"
            message="are you sure you want to leave this task?"
          />
        ) : null}

        {collaboratorToRemove ? (
          <DeleteConfirmation
            apiRoute={`main_task_collaborators/${params?.task_uuid}`}
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

        <div className="flex flex-col p-4 items-center justify-start w-full h-auto t:p-10  gap-4">
          <Link
            href="/hub/tasks"
            className="mr-auto hover:bg-secondary-500 transition-all
                      hover:bg-opacity-10 p-2 rounded-full"
          >
            <BsArrowLeft className="text-lg" />
          </Link>

          <div className="grid grid-cols-1 items-center justify-start w-full h-full gap-8 l-s:grid-cols-3">
            <SingleTaskMainData
              activeToolTip={activeToolTip}
              isTaskCreator={isTaskCreator}
              mainTaskBanner={taskData.main_task_banner}
              mainTaskDescription={taskData.main_task_description}
              mainTaskEndDate={taskData.main_task_end_date}
              mainTaskStartDate={taskData.main_task_start_date}
              mainTaskSubtitle={taskData.main_task_subtitle}
              mainTaskTitle={taskData.main_task_title}
              collaboratorCount={collaborators.length}
              toggleCanInvite={toggleCanInvite}
              toggleCanDeleteTask={toggleCanDeleteTask}
              toggleCanEditTask={toggleCanEditTask}
              toggleActiveToolTip={toggleActiveToolTip}
              toggleCanLeaveTask={toggleCanLeaveTask}
            />

            <div className="flex flex-col items-center justify-start w-full h-full gap-8 col-span-1 ">
              <div className="flex flex-col items-center justify-start w-full gap-2 col-span-1 ">
                <div className="flex flex-row w-full items-center justify-between">
                  <p className="text-2xl font-medium mr-auto">
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

              <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
                <p className="font-medium text-2xl">
                  {collaborators.length > 1 ? "Collaborators" : "Collaborator"}
                </p>

                <div className="flex flex-col gap-2 w-full">
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
