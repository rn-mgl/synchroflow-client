"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiFillPicture, AiOutlineClose, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { MdSubtitles, MdTitle } from "react-icons/md";
import { useGlobalContext } from "../../../context";
import Loading from "../global/Loading";
import useFile from "../hooks/useFile";
import useLoader from "../hooks/useLoading";
import DateComp from "../input/DateComp";
import SelectComp from "../input/SelectComp";
import TextAreaComp from "../input/TextAreaComp";
import TextComp from "../input/TextComp";
import { dateTimeForInput, localizeTime } from "../utils/dateUtils";
import { useParams } from "next/navigation";

interface SingleTaskDataStateProps {
  main_task_banner: string | null;
  main_task_by: number;
  main_task_description: string;
  main_main_task_priority: string;
  main_task_start_date: string;
  main_task_end_date: string;
  main_task_status: string;
  main_task_subtitle: string;
  main_task_title: string;
  main_task_uuid: string;
}

interface EditTaskProps {
  toggleCanEditTask: () => void;
  taskData: SingleTaskDataStateProps;
  getSingleTask: () => Promise<void>;
}

const EditTask: React.FC<EditTaskProps> = (props) => {
  const [mainTaskData, setMainTaskData] = React.useState({
    mainTaskTitle: props.taskData.main_task_title,
    mainTaskBanner: props.taskData.main_task_banner,
    mainTaskSubtitle: props.taskData.main_task_subtitle,
    mainTaskDescription: props.taskData.main_task_description,
    mainTaskStatus: props.taskData.main_task_status,
    mainTaskPriority: props.taskData.main_main_task_priority,
    mainTaskStartDate: props.taskData.main_task_start_date,
    mainTaskEndDate: props.taskData.main_task_end_date,
  });
  const { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile } = useFile();
  const { isLoading, handleLoader } = useLoader();

  const params = useParams();
  const { url, socket } = useGlobalContext();
  const { data: session } = useSession();
  const user = session?.user;

  const handleTaskData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setMainTaskData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const removeUploadedFile = () => {
    setMainTaskData((prev) => {
      return {
        ...prev,
        mainTaskBanner: null,
      };
    });
  };

  const editMainTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);
    try {
      let bannerURL = null;

      if (rawFile.current?.value) {
        bannerURL = await uploadFile(rawFile.current?.files);
        mainTaskData.mainTaskBanner = bannerURL;
      }

      const { data } = await axios.patch(
        `${url}/main_tasks/${params?.task_uuid}`,
        { mainTaskData },
        { headers: { Authorization: user?.token } }
      );
      if (data.updateTask) {
        props.toggleCanEditTask();
        await props.getSingleTask();
        socket.emit("update_task", { rooms: data.rooms });
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
        onSubmit={(e) => editMainTask(e)}
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4
                  max-w-screen-t overflow-y-auto cstm-scrollbar items-center justify-start"
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
            style={{ backgroundImage: `url(${fileData.url ? fileData.url : mainTaskData.mainTaskBanner})` }}
            className="w-full h-40 rounded-xl flex flex-col items-center justify-center
                      border-2 border-primary-200 bg-center bg-cover"
          >
            {rawFile.current?.value || mainTaskData.mainTaskBanner ? null : (
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
              {rawFile.current?.value || mainTaskData.mainTaskBanner ? null : (
                <AiOutlinePlus className="text-primary-500 peer-checked animate-fadeIn" />
              )}
            </label>

            {rawFile.current?.value || mainTaskData.mainTaskBanner ? (
              <button
                type="button"
                className="animate-fadeIn"
                onClick={rawFile.current?.value ? removeRawFile : removeUploadedFile}
              >
                <AiOutlineDelete className="text-primary-500" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Title</p>
          <TextComp
            name="mainTaskTitle"
            placeholder="Task Title..."
            required={true}
            value={mainTaskData.mainTaskTitle}
            onChange={handleTaskData}
            Icon={MdTitle}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Sub Title</p>
          <TextComp
            name="mainTaskSubtitle"
            placeholder="Task Sub Title..."
            required={true}
            value={mainTaskData.mainTaskSubtitle}
            onChange={handleTaskData}
            Icon={MdSubtitles}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Description</p>
          <TextAreaComp
            name="mainTaskDescription"
            placeholder="Task Description..."
            value={mainTaskData.mainTaskDescription}
            rows={5}
            required={true}
            onChange={handleTaskData}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">Priority</p>
          <SelectComp
            name="maintTaskPriority"
            value={mainTaskData.mainTaskPriority}
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
            name="mainTaskStatus"
            value={mainTaskData.mainTaskStatus}
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
            name="mainTaskStartDate"
            required={true}
            value={dateTimeForInput(mainTaskData.mainTaskStartDate)}
            onChange={handleTaskData}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">End Date</p>
          <DateComp
            name="mainTaskEndDate"
            required={true}
            value={dateTimeForInput(mainTaskData.mainTaskEndDate)}
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
