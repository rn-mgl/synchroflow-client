import React from "react";

interface Props {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const CheckBoxComp: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <button onClick={props.onClick} className="w-12 p-1 rounded-full border-[1px] flex flex-row items-center ">
        <div
          className={`w-5 h-5 rounded-full  transition-all ${
            props.isActive ? "bg-primary-500 translate-x-[1.10rem]" : "bg-neutral-400 translate-x-0"
          }`}
        />
      </button>
      <p>{props.label}</p>
    </div>
  );
};

export default CheckBoxComp;
