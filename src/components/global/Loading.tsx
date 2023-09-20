import React from "react";

const Loading = () => {
  return (
    <div
      className="animate-fadeIn fixed top-0 left-0 z-[999] backdrop-blur-md w-full 
                    h-full flex flex-col items-center justify-center"
    >
      <div className="flex flex-row gap-1 w-full items-center justify-center ">
        <div
          style={{ animationDelay: "0s" }}
          className="w-3 h-3 rounded-full bg-primary-400 animate-loading drop-shadow-md"
        />
        <div style={{ animationDelay: "-0.2s" }} className="w-3 h-3 rounded-full bg-primary-500 animate-loading" />
        <div style={{ animationDelay: "-0.4s" }} className="w-3 h-3 rounded-full bg-primary-600 animate-loading" />
        <div style={{ animationDelay: "-0.6s" }} className="w-3 h-3 rounded-full bg-primary-700 animate-loading" />
        <div style={{ animationDelay: "-0.8s" }} className="w-3 h-3 rounded-full bg-primary-800 animate-loading" />
        <div style={{ animationDelay: "-1s" }} className="w-3 h-3 rounded-full bg-primary-900 animate-loading" />
      </div>
    </div>
  );
};

export default Loading;
