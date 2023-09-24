import React from "react";
import { IconType } from "react-icons";

interface Props {
  placeholder: string;
  name: string;
  value: string;
  type: "text" | "password";
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewPassword: () => void;
  Icon: IconType;
}

const PasswordComp: React.FC<Props> = (props) => {
  return (
    <div className="w-full relative">
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
      <button onClick={props.viewPassword} type="button" className="absolute right-2 top-2/4 -translate-y-2/4">
        <props.Icon className="text-base text-primary-500 t:text-lg l-s:text-xl" />
      </button>
    </div>
  );
};

export default PasswordComp;
