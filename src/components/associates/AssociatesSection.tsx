import { AssociatesProps } from "@/src/interface/Associates";
import React, { JSX } from "react";
import AssociateCards from "../associates/AssociateCards";
import RecentAssociateCards from "../associates/RecentAssociateCards";

const AssociatesSection: React.FC<{
  associates: AssociatesProps[];
  label: string;
  type: "recent" | "all";
  handleDisconnectFromAssociate?: (associateUUID: string) => void;
}> = ({ associates, label, type, handleDisconnectFromAssociate }) => {
  const Card = type === "recent" ? RecentAssociateCards : AssociateCards;

  const mappedAssociates = associates.map((associate) => {
    return (
      <Card
        key={associate.associate_uuid}
        associate={associate}
        handleDisconnectFromAssociate={
          handleDisconnectFromAssociate
            ? () => handleDisconnectFromAssociate(associate.associate_uuid)
            : undefined
        }
      />
    );
  });

  return (
    <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 h-auto">
      <div className="flex flex-row justify-between w-full">
        <p className="font-semibold text-xl">{label}</p>
      </div>

      <div
        className={`w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-center justify-start gap-4 ${type === "recent" ? "min-h-[6rem]" : "min-h-[20rem]"}
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-2`}
      >
        {mappedAssociates}
      </div>
    </div>
  );
};

export default AssociatesSection;
