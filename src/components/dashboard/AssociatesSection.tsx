import { AssociatesProps } from "@/src/interface/Associates";
import React, { JSX } from "react";
import AssociateCards from "../associates/AssociateCards";

const AssociatesSection: React.FC<{
  associates: AssociatesProps[];
  label: string;
}> = (props) => {
  const mappedAssociates = props.associates.map((associate) => {
    return (
      <AssociateCards key={associate.associate_uuid} associate={associate} />
    );
  });

  return (
    <div
      className="w-full rounded-lg flex flex-col text-secondary-500 gap-2
                      t:col-span-2 min-h-[16rem] bg"
    >
      <div className="flex flex-row justify-between w-full">
        <p className="font-semibold text-xl">{props.label}</p>
      </div>

      <div
        className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-center justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2"
      >
        {mappedAssociates}
      </div>
    </div>
  );
};

export default AssociatesSection;
