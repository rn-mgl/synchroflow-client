"use client";
import { useGlobalContext } from "@/base/src/contexts/context";
import DeleteConfirmation from "@/components/global/DeleteConfirmation";
import SendTaskInvite from "@/components/invites/SendTaskInvite";
import CreateSubTask from "@/components/tasks/CreateSubTask";
import EditTask from "@/components/tasks/EditTask";
import SingleSubTask from "@/components/tasks/SingleSubTask";
import CollaboratorsSection from "@/src/components/tasks/CollaboratorsSection";
import SubTasksSection from "@/src/components/tasks/SubTasksSection";
import TaskBaseData from "@/src/components/tasks/TaskBaseData";
import {
  CollaboratorsStateProps,
  SingleTaskDataStateProps,
  SubTasksStateProps,
} from "@/src/interface/Tasks";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";

const SingleTask = () => {
  const [taskData, setTaskData] = React.useState<SingleTaskDataStateProps>({
    banner: "",
    task_by: 0,
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

  const getSingleTaskCollborators = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/task_collaborators`, {
          headers: { Authorization: user?.token },
          params: { taskUUID: params?.task_uuid, type: "main" },
        });

        if (data) {
          setCollaborators(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user, params]);

  const getSubTasks = React.useCallback(
    async (type: "assigned" | "created") => {
      try {
        if (!user?.token) return;

        if (type === "created" && !isTaskCreator) return;

        if (type === "assigned" && isTaskCreator) return;

        const { data } = await axios.get(`${url}/tasks`, {
          headers: { Authorization: user.token },
          params: { type, taskUUID: params?.task_uuid },
        });

        if (!data) return;

        if (type === "created") {
          setCreatedSubTasks(data);
        } else if (type === "assigned") {
          setAssignedSubTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [isTaskCreator, user, params, url],
  );

  const getSingleTask = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/tasks/${params?.task_uuid}`, {
          headers: { Authorization: user?.token },
        });

        if (data) {
          setTaskData(data);
          getSubTasks(data.task_by === user.id ? "created" : "assigned");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user, params, getSubTasks]);

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
      await getSubTasks("assigned");
    };

    socket?.on("refetch_assigned_subtask", handle);

    return () => {
      socket?.off("refetch_assigned_subtask", handle);
    };
  }, [socket, getSubTasks]);

  React.useEffect(() => {
    const handle = async () => {
      await getSubTasks("assigned");
    };

    socket?.on("reflect_update_subtask", handle);

    return () => {
      socket?.off("reflect_update_subtask", handle);
    };
  }, [socket, getSubTasks]);

  React.useEffect(() => {
    const handle = async () => {
      await getSubTasks("assigned");
      handleSelectedSubTask("");
    };

    socket?.on("reflect_delete_subtask", handle);

    return () => {
      socket?.off("reflect_delete_subtask", handle);
    };
  }, [socket, getSubTasks]);

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
            getCreatedSubTasks={() => getSubTasks("created")}
          />
        ) : null}

        {selectedSubTask ? (
          <SingleSubTask
            isTaskCreator={isTaskCreator}
            selectedSubTask={selectedSubTask}
            handleSelectedSubTask={handleSelectedSubTask}
            getCreatedSubTasks={() => getSubTasks("created")}
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
            title="Remove Collaborator"
            message="are you sure you want to remove this collaborator?"
          />
        ) : null}

        {canEditTask ? (
          <EditTask
            taskData={taskData}
            toggleCanEditTask={toggleCanEditTask}
            getSingleTask={getSingleTask}
          />
        ) : null}

        <div className="flex flex-col p-4 items-center justify-start w-full h-auto l-l:h-full t:p-10 gap-4 l-l:overflow-hidden">
          <Link
            href="/hub/tasks"
            className="mr-auto hover:bg-secondary-500 transition-all
                      hover:bg-opacity-10 p-2 w-8 h-8 rounded-full flex flex-col items-center justify-center"
          >
            <BsArrowLeft className="text-lg" />
          </Link>

          <div className="grid grid-cols-1 items-center justify-start w-full h-auto l-l:h-full gap-8 l-l:grid-cols-3 l-l:overflow-hidden">
            <div className="flex flex-col items-center justify-start w-full h-auto l-l:h-full gap-8 col-span-1 l-l:col-span-2 l-l:overflow-hidden">
              <TaskBaseData
                activeToolTip={activeToolTip}
                isTaskCreator={isTaskCreator}
                taskData={taskData}
                toggleActiveToolTip={toggleActiveToolTip}
                toggleCanDeleteTask={toggleCanDeleteTask}
                toggleCanEditTask={toggleCanEditTask}
                toggleCanLeaveTask={toggleCanLeaveTask}
              />
            </div>

            <div className="flex flex-col items-center justify-start w-full h-auto gap-8 col-span-1 l-l:h-full overflow-hidden">
              <SubTasksSection
                isTaskCreator={isTaskCreator}
                subTasks={isTaskCreator ? createdSubTasks : assignedSubTasks}
                toggleCanCreateSubTask={toggleCanCreateSubTask}
                handleSelectedSubTask={handleSelectedSubTask}
              />

              <CollaboratorsSection
                collaborators={collaborators}
                isTaskCreator={isTaskCreator}
                toggleCanInvite={toggleCanInvite}
                handleCollaboratorToRemove={handleCollaboratorToRemove}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTask;
