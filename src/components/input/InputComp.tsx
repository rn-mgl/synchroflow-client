import React from "react";
import { IconType } from "react-icons";

interface Props {
  placeholder: string;
  name: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: IconType | null;
  required: boolean;
}

const InputComp: React.FC<Props> = (props) => {
  return (
    <input
      type={props.type}
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
  );
};

export default InputComp;
