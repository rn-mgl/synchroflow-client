import React from "react";

interface SelectCompProps {
  name: string;
  value: string;
  labelValuePair: Array<{ label: string; value: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectComp: React.FC<SelectCompProps> = (props) => {
  const mappedLabelValues = props.labelValuePair.map((pair, index) => {
    return (
      <option value={pair.value} key={index}>
        {pair.label}
      </option>
    );
  });

  return (
    <select
      name={props.name}
      value={props.value}
      onChange={(e) => props.onChange(e)}
      className="p-2 border-[1px] rounded-md resize-none
      border-primary-600 w-full focus:outline-none
      focus:border-b-4 transition-all"
    >
      {mappedLabelValues}
    </select>
  );
};

export default SelectComp;
