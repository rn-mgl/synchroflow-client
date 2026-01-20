import { useGlobalContext } from "@/base/src/contexts/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { TbMoodX } from "react-icons/tb";
import { localizeDate } from "../utils/dateUtils";
import { PRIORITY_STYLE } from "../utils/taskUtils";

interface TaskCardProps {
  title: string;
  banner: string;
  subTitle: string;
  status: string;
  taskUUID: string;
  deadline: string;
  priority: string;
}

interface CollaboratorsProps {
  name: string;
  surname: string;
  user_uuid: string;
  image: string;
}

const TaskCards: React.FC<TaskCardProps> = (props) => {
  const [collaborators, setCollaborators] = React.useState<
    Array<CollaboratorsProps>
  >([]);

  const { socket } = useGlobalContext();
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const getCollaborators = React.useCallback(async () => {
    if (user?.token) {
      try {
        const { data } = await axios.get(`${url}/main_task_collaborators`, {
          headers: { Authorization: user?.token },
          params: { mainTaskUUID: props.taskUUID },
        });
        if (data) {
          setCollaborators(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [url, user?.token, props.taskUUID]);

  const mappedCollaborators = collaborators
    .slice(0, collaborators.length < 5 ? collaborators.length : 5)
    .map((collaborator, index) => {
      return (
        <div
          style={{
            right: `${index}rem`,
            backgroundImage: `url(${collaborator.image})`,
          }}
          key={collaborator.user_uuid}
          className="w-6 h-6 rounded-full bg-secondary-300 
          border-2 border-white absolute bg-cover bg-center group"
        >
          <div
            className="hidden group-hover:flex absolute -translate-y-7 
                        left-2/4 -translate-x-2/4 bg-secondary-500 text-white rounded-sm p-1"
          >
            <p className="text-xs whitespace-nowrap">
              {collaborator.name} {collaborator.surname}
            </p>
          </div>
        </div>
      );
    });

  React.useEffect(() => {
    getCollaborators();
  }, [getCollaborators]);

  React.useEffect(() => {
    const handle = async (args: { mainTaskUUID: string }) => {
      if (props.taskUUID === args.mainTaskUUID) {
        await getCollaborators();
      }
    };

    socket?.on("refetch_tasks_collaborators", handle);

    return () => {
      socket?.off("refetch_tasks_collaborators", handle);
    };
  }, [socket, props.taskUUID, getCollaborators]);

  return (
    <Link
      href={`/hub/tasks/${props.taskUUID}`}
      className="flex flex-row gap-4 justify-center min-w-[20rem] w-80 select-none min-h-[16rem] h-auto max-h-[20rem]"
    >
      <div className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md">
        <p className="font-bold text-left max-w-[12ch] truncate text-sm">
          {props.title}
        </p>

        <div
          style={{ backgroundImage: `url(${props.banner})` }}
          className="bg-primary-100 w-full h-36 rounded-md bg-center bg-cover
                      hover:shadow-[0rem_0.2rem_0.4rem_#14152233_inset] bg-gradient-to-br 
                      from-primary-100 to-primary-400 overflow-hidden group"
        />

        <div className="w-full flex flex-row justify-between">
          <p
            className={`font-medium text-left max-w-[12ch] truncate text-sm capitalize ${
              PRIORITY_STYLE[props.priority as keyof object]
            }`}
          >
            {props.priority}
          </p>
          <p className="font-light text-right max-w-[12ch] truncate text-sm italic capitalize">
            {props.status}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-1 items-center justify-center text-xs">
            <AiOutlineClockCircle />
            <p className="text-xs">{localizeDate(props.deadline, false)}</p>
          </div>

          <div className="flex flex-row gap-1 items-center justify-center relative">
            {collaborators.length ? (
              mappedCollaborators
            ) : (
              <div className="opacity-50">
                <TbMoodX />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCards;
