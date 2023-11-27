"use client";
import { useGlobalContext } from "@/base/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdSubtitles, MdTitle } from "react-icons/md";
import Loading from "../global/Loading";
import useLoader from "../hooks/useLoading";
import DateComp from "../input/DateComp";
import SelectComp from "../input/SelectComp";
import TextAreaComp from "../input/TextAreaComp";
import TextComp from "../input/TextComp";

interface CreateSubTaskProps {
  toggleCanCreateSubTask: () => void;
  getCreatedSubTasks: () => Promise<void>;
}

const CreateSubTask: React.FC<CreateSubTaskProps> = (props) => {
  const [subTaskData, setSubTaskData] = React.useState({
    subTaskTitle: "",
    subTaskSubtitle: "",
    subTaskDescription: "",
    subTaskPriority: "important",
    subTaskStartDate: undefined,
    subTaskEndDate: undefined,
  });
  const { isLoading, handleLoader } = useLoader();
  const params = useParams();

  const { url } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const handleTaskData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setSubTaskData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createSubTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);
    try {
      const { data } = await axios.post(
        `${url}/sub_tasks`,
        { subTaskData, mainTaskUUID: params?.task_uuid },
        { headers: { Authorization: user?.token } }
      );
      if (data) {
        await props.getCreatedSubTasks();
        props.toggleCanCreateSubTask();
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
        onSubmit={(e) => createSubTask(e)}
        className="w-full bg-white h-fit rounded-lg flex flex-col p-4 t:p-10 gap-4
                  max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanCreateSubTask}
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
          <p className="text-xs">Start Date</p>
          <DateComp
            name="subTaskStartDate"
            required={true}
            value={subTaskData.subTaskStartDate}
            onChange={handleTaskData}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">End Date</p>
          <DateComp
            name="subTaskEndDate"
            required={true}
            value={subTaskData.subTaskEndDate}
            onChange={handleTaskData}
          />
        </div>

        <button
          type="submit"
          className="bg-primary-500 rounded-lg text-white 
                    font-bold p-2 w-full"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreateSubTask;
