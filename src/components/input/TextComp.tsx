import React from "react";
import { IconType } from "react-icons";

interface Props {
  placeholder: string;
  name: string;
  value: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: IconType;
}

const TextComp: React.FC<Props> = (props) => {
  return (
    <div className="w-full relative">
      <input
        type="text"
        className="p-2 border-[1px] rounded-md 
                border-primary-600 w-full focus:outline-none
                focus:border-b-4 transition-all"
        placeholder={props.placeholder}
        name={props.name}
        id={props.name}
        onChange={(e) => props.onChange(e)}
        value={props.value}
        required={props.required}
      />
      <div className="absolute right-2 top-2/4 -translate-y-2/4">
        <props.Icon className="text-base text-primary-500 t:text-lg l-s:text-xl" />
      </div>
    </div>
  );
};

export default TextComp;
