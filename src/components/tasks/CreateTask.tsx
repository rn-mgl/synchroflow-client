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

interface CreateTaskProps {
  toggleCanCreateTask: () => void;
  getMyTasks: () => Promise<void>;
  getCollaboratedTasks: () => Promise<void>;
}

const CreateTask: React.FC<CreateTaskProps> = (props) => {
  const [mainTaskData, setMainTaskData] = React.useState({
    mainTaskTitle: "",
    mainTaskBanner: null,
    mainTaskSubtitle: "",
    mainTaskDescription: "",
    maintTaskPriority: "important",
    mainTaskStartDate: undefined,
    mainTaskEndDate: undefined,
  });
  const { rawFile, fileData, removeRawFile, selectedFileViewer, uploadFile } =
    useFile();
  const { isLoading, handleLoader } = useLoader();

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const handleTaskData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setMainTaskData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const createMainTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLoader(true);
    try {
      let bannerURL = null;

      const passedData = { ...mainTaskData };

      if (rawFile.current) {
        bannerURL = await uploadFile(rawFile.current?.files);
      }

      passedData.mainTaskBanner = bannerURL;

      const { data } = await axios.post(
        `${url}/main_tasks`,
        { mainTaskData: passedData },
        { headers: { Authorization: user?.token } },
      );
      if (data) {
        await props.getMyTasks();
        await props.getCollaboratedTasks();
        props.toggleCanCreateTask();
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
        onSubmit={(e) => createMainTask(e)}
        className="w-full bg-white h-full rounded-lg flex flex-col p-4 t:p-10 gap-4
                  max-w-screen-l-s overflow-y-auto cstm-scrollbar items-center justify-start"
      >
        <button
          onClick={props.toggleCanCreateTask}
          type="button"
          className="ml-auto hover:bg-primary-500 rounded-full 
                    hover:bg-opacity-20 transition-all p-2"
        >
          <AiOutlineClose className="text-secondary-500" />
        </button>

        <div className="flex flex-col w-full items-center justify-center">
          <div
            style={{ backgroundImage: `url(${fileData.url})` }}
            className="w-full h-40 rounded-xl flex flex-col items-center justify-center
                      border-2 border-primary-200 bg-center bg-cover"
          >
            {fileData.url ? null : (
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
              {fileData.url ? null : (
                <AiOutlinePlus className="text-primary-500 peer-checked animate-fadeIn" />
              )}
            </label>

            {fileData.url ? (
              <button
                type="button"
                className="animate-fadeIn"
                onClick={removeRawFile}
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
            value={mainTaskData.maintTaskPriority}
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
            name="mainTaskStartDate"
            required={true}
            value={mainTaskData.mainTaskStartDate}
            onChange={handleTaskData}
          />
        </div>

        <div className="w-full flex flex-col items-start justify-center gap-2">
          <p className="text-xs">End Date</p>
          <DateComp
            name="mainTaskEndDate"
            required={true}
            value={mainTaskData.mainTaskEndDate}
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

export default CreateTask;
