import React from "react";

interface DateCompProps {
  name: string;
  value: string | undefined;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateComp: React.FC<DateCompProps> = (props) => {
  return (
    <input
      name={props.name}
      value={props.value}
      onChange={(e) => props.onChange(e)}
      required={props.required}
      type="datetime-local"
      className="p-2 border-[1px] rounded-md resize-none
                border-primary-600 w-full focus:outline-none
                focus:border-b-4 transition-all"
    />
  );
};

export default DateComp;
