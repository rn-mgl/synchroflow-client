import React from "react";
import CheckBoxComp from "../input/CheckBoxComp";

const Notification = () => {
  const [status, setStatus] = React.useState<{ [name: string]: boolean }>({
    messages: false,
    taskUpdate: false,
    taskDeadline: false,
    associateInvites: false,
  });

  const handleStatus = (name: "messages" | "taskUpdate" | "taskDeadline" | "associateInvites") => {
    setStatus((prev: { [name: string]: boolean }) => {
      return {
        ...prev,
        [name]: !prev[name],
      };
    });
  };

  return (
    <div className="bg-white w-full p-4 flex flex-col gap-10 rounded-lg h-fit">
      <div className="flex flex-col w-full items-start justify-center gap-4 text-sm">
        <CheckBoxComp isActive={status.messages} label="Messages" onClick={() => handleStatus("messages")} />

        <CheckBoxComp isActive={status.taskUpdate} label="Task Update" onClick={() => handleStatus("taskUpdate")} />

        <CheckBoxComp
          isActive={status.taskDeadline}
          label="Task Deadline"
          onClick={() => handleStatus("taskDeadline")}
        />

        <CheckBoxComp
          isActive={status.associateInvites}
          label="Associate Invites"
          onClick={() => handleStatus("associateInvites")}
        />
      </div>

      <button
        className="bg-primary-500 text-white font-semibold 
                        p-2 rounded-lg t:w-fit t:px-10"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Notification;
