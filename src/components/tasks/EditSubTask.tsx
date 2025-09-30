"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdSubtitles, MdTitle } from "react-icons/md";
import Loading from "../global/Loading";
import useLoader from "../hooks/useLoading";
import DateComp from "../input/DateComp";
import SelectComp from "../input/SelectComp";
import TextAreaComp from "../input/TextAreaComp";
import TextComp from "../input/TextComp";
import { dateTimeForInput } from "../utils/dateUtils";
import { useParams } from "next/navigation";

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

interface EditSubTaskProps {
  subTaskData: SubTaskDataStateProps;
  toggleCanEditSubTask: () => void;
  getSubTask: () => Promise<void>;
  getCreatedSubTasks: () => Promise<void>;
}

const EditSubTask: React.FC<EditSubTaskProps> = (props) => {
  const [subTaskData, setSubTaskData] = React.useState({
    subTaskTitle: props.subTaskData.sub_task_title,
    subTaskSubtitle: props.subTaskData.sub_task_subtitle,
    subTaskDescription: props.subTaskData.sub_task_description,
    subTaskPriority: props.subTaskData.sub_task_priority,
    subTaskStatus: props.subTaskData.sub_task_status,
    subTaskStartDate: props.subTaskData.sub_task_start_date,
    subTaskEndDate: props.subTaskData.sub_task_end_date,
  });
  const { isLoading, handleLoader } = useLoader();

  const { socket } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;
  const params = useParams();
  const url = process.env.API_URL;

  const handleTaskData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setSubTaskData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const editSubTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);
    try {
      const { data } = await axios.patch(
        `${url}/sub_tasks/${props.subTaskData.sub_task_uuid}`,
        { subTaskData },
        {
          headers: { Authorization: user?.token },
          params: { mainTaskUUID: params?.task_uuid },
        }
      );
      if (data.updateSubTask) {
        await props.getSubTask();
        await props.getCreatedSubTasks();
        props.toggleCanEditSubTask();
        socket.emit("update_subtask", { rooms: data.rooms });
      }
    } catch (error) {
      handleLoader(false);
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full fixed top-0 left-0 backdrop-blur-md z-20 animate-fadeIn
            bg-gradient-to-br from-[#546FFF33] to-[#8E92BC33]
            flex flex-col items-center justify-start p-4 t:p-10"
    >
      {isLoading ? <Loading /> : null}

      <form
        onSubmit={(e) => editSubTask(e)}
        className="w-full bg-white h-fit rounded-lg flex flex-col p-4 t:p-10 gap-4 my-auto
                  max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanEditSubTask}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Title</p>
          <TextComp
            name="subTaskTitle"
            placeholder="Task Title..."
            required={true}
            value={subTaskData.subTaskTitle}
            onChange={handleTaskData}
            Icon={MdTitle}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Sub Title</p>
          <TextComp
            name="subTaskSubtitle"
            placeholder="Task Sub Title..."
            required={true}
            value={subTaskData.subTaskSubtitle}
            onChange={handleTaskData}
            Icon={MdSubtitles}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Description</p>
          <TextAreaComp
            name="subTaskDescription"
            placeholder="Task Description..."
            value={subTaskData.subTaskDescription}
            rows={5}
            required={true}
            onChange={handleTaskData}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Priority</p>
          <SelectComp
            name="subTaskPriority"
            value={subTaskData.subTaskPriority}
            onChange={handleTaskData}
            labelValuePair={[
              { label: "Critical Task", value: "critical" },
              { label: "Important Task", value: "important" },
              { label: "Non-Essential Tasks", value: "none" },
            ]}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Status</p>
          <SelectComp
            name="subTaskStatus"
            value={subTaskData.subTaskStatus}
            onChange={handleTaskData}
            labelValuePair={[
              { label: "Ongoing", value: "ongoing" },
              { label: "Hold", value: "hold" },
              { label: "Done", value: "done" },
            ]}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Start Date</p>
          <DateComp
            name="subTaskStartDate"
            required={true}
            value={dateTimeForInput(subTaskData.subTaskStartDate)}
            onChange={handleTaskData}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">End Date</p>
          <DateComp
            name="subTaskEndDate"
            required={true}
            value={dateTimeForInput(subTaskData.subTaskEndDate)}
            onChange={handleTaskData}
          />
        </div>

        <button
          type="submit"
          className="bg-primary-500 rounded-lg text-white 
                    font-bold p-2 w-full"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditSubTask;
