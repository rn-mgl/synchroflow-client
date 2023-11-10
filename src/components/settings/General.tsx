import React from "react";

const General = () => {
  return (
    <div className="bg-white w-full p-4 flex flex-col gap-10 rounded-lg h-fit">
      <div className="flex flex-row w-full items-center justify-start gap-2 text-sm">
        <div className="flex flex-row items-center justify-center gap-4">
          <input type="range" className="text-primary-500 bg-primary-500 w-24" />

          <p>Notification Sound</p>
        </div>
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

export default General;
