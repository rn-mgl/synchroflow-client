import Link from "next/link";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { localizeDate } from "../utils/dateUtils";
import { useGlobalContext } from "@/base/context";
import { useSession } from "next-auth/react";
import axios from "axios";

interface TaskCardProps {
  title: string;
  banner: string;
  subTitle: string;
  status: string;
  taskUUID: string;
  deadline: string;
}

interface CollaboratorsProps {
  name: string;
  surname: string;
  user_uuid: string;
  image: string;
}

const TaskCards: React.FC<TaskCardProps> = (props) => {
  const [collaborators, setCollaborators] = React.useState<Array<CollaboratorsProps>>([]);

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

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
        <Link
          href={`/hub/associates/${collaborator.user_uuid}`}
          style={{ right: `${index}rem`, backgroundImage: `url(${collaborator.image})` }}
          key={index}
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
        </Link>
      );
    });

  React.useEffect(() => {
    getCollaborators();
  }, [getCollaborators]);

  return (
    <div className="flex flex-row gap-4 justify-center min-w-[20rem] w-80 h-full select-none">
      <div className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md">
        <Link
          href={`/hub/tasks/${props.taskUUID}`}
          style={{ backgroundImage: `url(${props.banner})` }}
          className="bg-primary-100 w-full h-full rounded-2xl bg-center bg-cover
                      hover:shadow-[0rem_0.2rem_0.4rem_#141522_inset] transition-all"
        />

        <div className="w-full flex flex-row justify-between">
          <p className="font-bold">{props.title}</p>
          <p className="font-light">{props.subTitle}</p>
        </div>

        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between text-sm">
            <p className="font-bold text-secondary-400">Progress</p>
            <p className="text-primary-500 capitalize">{props.status}</p>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center justify-center">
            <div>
              <AiOutlineClockCircle className="text-xl" />
            </div>
            <p className="text-sm">{localizeDate(props.deadline, false)}</p>
          </div>

          <div className="flex flex-row gap-2 items-center justify-center relative">
            {collaborators.length ? mappedCollaborators : <p>-</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCards;
