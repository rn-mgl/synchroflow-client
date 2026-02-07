import React from "react";
import { AssociatesProps } from "@/src/interface/Associates";

interface RecentAssociateCardsProps {
  associate: AssociatesProps;
}

const RecentAssociateCards: React.FC<RecentAssociateCardsProps> = (props) => {
  const image = props.associate.image;
  const name = props.associate.name;
  const surname = props.associate.surname;
  const role = props.associate.role;

  return (
    <div className="flex flex-row gap-4 justify-center w-full h-fit select-none ">
      <div className="bg-white w-full p-4 rounded-lg h-full flex flex-col gap-2 hover:shadow-md overflow-y-auto">
        <div className="flex flex-row gap-1 items-center justify-center">
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="bg-primary-100 w-12 min-w-[3rem] h-12 min-h-[3rem] rounded-full mr-auto
                        bg-center bg-cover"
          />
          <div className="flex flex-col gap-1 items-end">
            <p className="font-bold truncate max-w-[20ch]">
              {name} {surname}
            </p>
            <p className="text-xs max-w-[20ch] truncate">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentAssociateCards;
