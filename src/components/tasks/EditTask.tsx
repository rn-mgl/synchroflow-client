"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import {
  AiFillPicture,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlinePlus,
} from "react-icons/ai";
import { MdSubtitles, MdTitle } from "react-icons/md";
import { useGlobalContext } from "@/base/src/contexts/context";
import Loading from "../global/Loading";
import useFile from "../../hooks/useFile";
import useLoader from "../../hooks/useLoading";
import DateComp from "../input/DateComp";
import SelectComp from "../input/SelectComp";
import TextAreaComp from "../input/TextAreaComp";
import TextComp from "../input/TextComp";
import { dateTimeForInput, localizeTime } from "../../utils/dateUtils";
import { useParams } from "next/navigation";

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

interface EditTaskProps {
  toggleCanEditTask: () => void;
  taskData: SingleTaskDataStateProps;
  getSingleTask: () => Promise<void>;
}

const EditTask: React.FC<EditTaskProps> = (props) => {
  const [taskData, setTaskData] = React.useState({
    taskTitle: props.taskData.title,
    taskBanner: props.taskData.banner,
    taskSubtitle: props.taskData.subtitle,
    taskDescription: props.taskData.description,
    taskStatus: props.taskData.status,
    taskPriority: props.taskData.priority,
    taskStartDate: props.taskData.start_date,
    taskEndDate: props.taskData.end_date,
  });
  const { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile } =
    useFile();
  const { isLoading, handleLoader } = useLoader();

  const params = useParams();
  const { socket } = useGlobalContext();
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const handleTaskData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setTaskData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const removeUploadedFile = () => {
    setTaskData((prev) => {
      return {
        ...prev,
        taskBanner: null,
      };
    });
  };

  const editTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);
    try {
      let bannerURL = null;

      const passedData = { ...taskData };

      if (rawFile.current?.value) {
        bannerURL = await uploadFile(rawFile.current?.files);
        passedData.taskBanner = bannerURL;
      }

      const { data } = await axios.patch(
        `${url}/tasks/${params?.task_uuid}`,
        { taskData: passedData },
        { headers: { Authorization: user?.token } },
      );
      if (data.updateTask) {
        props.toggleCanEditTask();
        await props.getSingleTask();
        socket?.emit("update_task", { rooms: data.rooms });
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
        onSubmit={(e) => editTask(e)}
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4
                  max-w-screen-l-s overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanEditTask}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="flex flex-col w-full items-center justify-center">
          <div
            style={{
              backgroundImage: `url(${
                fileData.url ? fileData.url : taskData.taskBanner
              })`,
            }}
            className="w-full h-40 rounded-xl flex flex-col items-center justify-center
                      border-2 border-primary-200 bg-center bg-cover"
          >
            {fileData.url || taskData.taskBanner ? null : (
              <AiFillPicture className="text-primary-200 text-4xl" />
            )}
          </div>

          <div className="flex flex-row w-full items-center justify-between py-2">
            <p className="mt-auto text-sm opacity-50">Banner Image</p>

            <label className="cursor-pointer">
              <input
                ref={rawFile}
                type="file"
                formNoValidate
                accept="image/*"
                className="hidden peer"
                onChange={(e) => selectedFileViewer(e)}
              />
              {fileData.url || taskData.taskBanner ? null : (
                <AiOutlinePlus className="text-primary-500 peer-checked animate-fadeIn" />
              )}
            </label>

            {fileData.url || taskData.taskBanner ? (
              <button
                type="button"
                className="animate-fadeIn"
                onClick={fileData.url ? removeRawFile : removeUploadedFile}
              >
                <AiOutlineDelete className="text-primary-500" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Title</p>
          <TextComp
            name="taskTitle"
            placeholder="Task Title..."
            required={true}
            value={taskData.taskTitle}
            onChange={handleTaskData}
            Icon={MdTitle}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Sub Title</p>
          <TextComp
            name="taskSubtitle"
            placeholder="Task Sub Title..."
            required={true}
            value={taskData.taskSubtitle}
            onChange={handleTaskData}
            Icon={MdSubtitles}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Description</p>
          <TextAreaComp
            name="taskDescription"
            placeholder="Task Description..."
            value={taskData.taskDescription}
            rows={5}
            required={true}
            onChange={handleTaskData}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Priority</p>
          <SelectComp
            name="taskPriority"
            value={taskData.taskPriority}
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
            name="taskStatus"
            value={taskData.taskStatus}
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
            name="taskStartDate"
            required={true}
            value={dateTimeForInput(taskData.taskStartDate)}
            onChange={handleTaskData}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">End Date</p>
          <DateComp
            name="taskEndDate"
            required={true}
            value={dateTimeForInput(taskData.taskEndDate)}
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

export default EditTask;
