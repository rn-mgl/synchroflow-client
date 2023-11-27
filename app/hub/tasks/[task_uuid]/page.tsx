"use client";
import { useGlobalContext } from "@/base/context";
import SendTaskInvite from "@/components//invites/SendTaskInvite";
import AssignSubTask from "@/components//tasks/AssignSubTask";
import AsssignedSubTasks from "@/components//tasks/AsssignedSubTasks";
import CreateSubTask from "@/components//tasks/CreateSubTask";
import CreatedSubTasks from "@/components//tasks/CreatedSubTasks";
import SingleTaskMainData from "@/components//tasks/SingleTaskMainData";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

interface SingleTaskData {
  main_task_banner: string | null;
  main_task_by: number;
  main_task_description: string;
  main_main_task_priority: string;
  main_task_start_date: string;
  main_task_end_date: string;
  main_tast_status: string;
  main_task_subtitle: string;
  main_task_title: string;
  main_task_uuid: string;
}

interface AssignedSubTasksStateProps {
  sub_task_title: string;
  sub_task_subtitle: string;
}

interface CreatedSubTasksStateProps {
  sub_task_title: string;
  sub_task_subtitle: string;
  sub_task_uuid: string;
}

interface CollaboratorsStateProps {
  name: string;
  surname: string;
  image: string;
  user_uuid: string;
}

const SingleTask = () => {
  const [taskData, setTaskData] = React.useState<SingleTaskData>({
    main_task_banner: "",
    main_task_by: -1,
    main_task_description: "",
    main_main_task_priority: "",
    main_task_start_date: "",
    main_task_end_date: "",
    main_tast_status: "",
    main_task_subtitle: "",
    main_task_title: "",
    main_task_uuid: "",
  });
  const [collaborators, setCollaborators] = React.useState<Array<CollaboratorsStateProps>>([]);
  const [createdSubTasks, setCreatedSubTasks] = React.useState<Array<CreatedSubTasksStateProps>>([]);
  const [assignedSubTasks, setAssignedSubTasks] = React.useState<Array<AssignedSubTasksStateProps>>([]);
  const [selectedSubTask, setSelectedSubTask] = React.useState("");
  const [canInvite, setCanInvite] = React.useState(false);
  const [canCreateSubTask, setCanCreateSubTask] = React.useState(false);

  const params = useParams();
  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;
  const isTaskCreator = user?.id === taskData.main_task_by;

  const toggleCanInvite = () => {
    setCanInvite((prev) => !prev);
  };

  const toggleCanCreateSubTask = () => {
    setCanCreateSubTask((prev) => !prev);
  };

  const handleSelectedSubTask = (subTaskUUID: string) => {
    setSelectedSubTask((prev) => (prev === subTaskUUID ? "" : subTaskUUID));
  };

  const getSingleTask = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_tasks/${params?.task_uuid}`, {
          headers: { Authorization: user?.token },
        });

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
    if (user?.token) {
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
  }, [url, user?.token]);

  const getAssignedSubTasks = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/sub_tasks`, {
          headers: { Authorization: user?.token },
          params: { type: "collaborated" },
        });
        if (data) {
          setAssignedSubTasks(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token]);

  const mappedCollaborators = collaborators.map((collaborator, index) => {
    return (
      <div key={index} className="flex flex-col gap-2 items-center justify-start w-full">
        <div className="flex flex-row gap-2 items-center justify-start w-full">
          <div
            style={{ backgroundImage: `url(${collaborator.image})` }}
            className="w-8 h-8 min-w-[2rem] min-h-[2rem] bg-primary-200 rounded-full bg-center bg-cover"
          />
          <div className="flex flex-row w-full items-center justify-between">
            <p>
              {collaborator.name} {collaborator.surname}
            </p>
          </div>
        </div>
        {index !== collaborators.length - 1 ? <div className="w-full h-[1px] bg-secondary-200" /> : null}
      </div>
    );
  });

  React.useEffect(() => {
    getSingleTask();
  }, [getSingleTask]);

  React.useEffect(() => {
    getSingleTaskCollborators();
  }, [getSingleTaskCollborators]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
            items-center w-full h-full"
      >
        {canInvite ? <SendTaskInvite taskUUID={taskData.main_task_uuid} toggleCanInvite={toggleCanInvite} /> : null}
        {canCreateSubTask ? (
          <CreateSubTask toggleCanCreateSubTask={toggleCanCreateSubTask} getCreatedSubTasks={getCreatedSubTasks} />
        ) : null}
        {selectedSubTask ? (
          <AssignSubTask
            selectedSubTask={selectedSubTask}
            collaborators={collaborators}
            handleSelectedSubTask={handleSelectedSubTask}
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
              isTaskCreator={isTaskCreator}
              mainTaskBanner={taskData.main_task_banner}
              mainTaskDescription={taskData.main_task_description}
              mainTaskEndDate={taskData.main_task_end_date}
              mainTaskStartDate={taskData.main_task_start_date}
              mainTaskSubtitle={taskData.main_task_subtitle}
              mainTaskTitle={taskData.main_task_title}
              collaboratorCount={collaborators.length}
              toggleCanInvite={toggleCanInvite}
            />

            <div className="flex flex-col items-center justify-start w-full h-full gap-8 col-span-1 ">
              <div className="flex flex-col items-center justify-start w-full gap-2 col-span-1 ">
                <div className="flex flex-row w-full items-center justify-between">
                  <p className="text-2xl font-medium mr-auto">
                    {isTaskCreator ? "Created Sub Tasks" : "Your Sub Tasks"}
                  </p>

                  <button
                    onClick={toggleCanCreateSubTask}
                    className="flex flex-row gap-1 items-center text-xs text-primary-500
                      hover:underline hover:underline-offset-2 whitespace-nowrap"
                  >
                    <AiOutlinePlus /> Sub Task
                  </button>
                </div>

                {isTaskCreator ? (
                  <CreatedSubTasks
                    getCreatedSubTasks={getCreatedSubTasks}
                    handleSelectedSubTask={handleSelectedSubTask}
                    createdSubTasks={createdSubTasks}
                  />
                ) : (
                  <AsssignedSubTasks getAssignedSubTasks={getAssignedSubTasks} assignedSubTasks={assignedSubTasks} />
                )}
              </div>

              <div className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500">
                <p className="font-medium text-2xl">{collaborators.length > 1 ? "Collaborators" : "Collaborator"}</p>

                <div className="flex flex-col gap-2 w-full">{mappedCollaborators}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTask;
