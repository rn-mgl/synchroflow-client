import React from "react";
import { IconType } from "react-icons";

interface Props {
  placeholder: string;
  name: string;
  value: string;
  required: boolean;
  activeFilterOptions: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: IconType;
}

const SearchFilter: React.FC<Props> = (props) => {
  return (
    <div
      className={`w-full relative flex-row items-center justify-between mr-auto h-fit t:flex
                ${props.activeFilterOptions ? "hidden" : "flex"}`}
    >
      <input
        type="text"
        className="p-4 t:px-6 border-[1px] rounded-md  text-xs
            border-secondary-100 w-full focus:outline-none
            focus:border-b-4 transition-all"
        placeholder={props.placeholder}
        name={props.name}
        id={props.name}
        onChange={(e) => props.onChange(e)}
        value={props.value}
        required={props.required}
      />
      <div className="absolute right-2 top-2/4 -translate-y-2/4">
        <props.Icon className="text-base text-secondary-300 t:text-lg l-s:text-xl" />
      </div>
    </div>
  );
};

export default SearchFilter;
