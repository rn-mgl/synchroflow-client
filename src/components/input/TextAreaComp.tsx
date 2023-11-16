import React, { ChangeEvent } from "react";

interface TextAreaCompProps {
  name: string;
  placeholder: string;
  value: string;
  rows: number;
  required: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaComp: React.FC<TextAreaCompProps> = (props) => {
  return (
    <textarea
      className="p-2 border-[1px] rounded-md resize-none
            border-primary-600 w-full focus:outline-none
            focus:border-b-4 transition-all cstm-scrollbar"
      rows={props.rows}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      required={props.required}
      onChange={(e) => props.onChange(e)}
    />
  );
};

export default TextAreaComp;
