"use client";
import General from "@/components//settings/General";
import Notification from "@/components//settings/Notification";
import React from "react";

const Settings = () => {
  const [activeNav, setActiveNav] = React.useState<"general" | "notification">("general");

  const handleActiveNav = (type: "general" | "notification") => {
    setActiveNav(type);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-auto">
      <div
        className="max-w-screen-2xl flex flex-col justify-start 
            items-center w-full h-full"
      >
        <div className="flex flex-col w-full items-center justify-start p-4 t:p-10 gap-4 h-auto">
          <div className="bg-white w-full p-4 pb-0 flex flex-col gap-4 rounded-lg h-fit">
            <p className="font-semibold text-xl">Settings</p>

            <div className="flex flex-row w-full items-center justify-start gap-2 text-sm">
              <button
                onClick={() => handleActiveNav("general")}
                className={`p-4 hover:bg-neutral-100 transition-all
                      ${activeNav === "general" && "border-b-2 border-primary-500"}`}
              >
                General
              </button>
              <button
                onClick={() => handleActiveNav("notification")}
                className={`p-4 hover:bg-neutral-100 transition-all
                        ${activeNav === "notification" && "border-b-2 border-primary-500"}`}
              >
                Notification
              </button>
            </div>
          </div>

          {activeNav === "general" ? <General /> : activeNav === "notification" ? <Notification /> : null}
        </div>
      </div>
    </div>
  );
};

export default Settings;
