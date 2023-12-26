import React from "react";
import { AiFillStar, AiOutlineFileText } from "react-icons/ai";
import { AssociatesProps } from "../hooks/useAssociates";

interface RecentAssociateCardsProps {
  associate: AssociatesProps;
  selectedAssociate: string;
  associateUUID: string;
  targetIdentity: "of" | "is";
  handleSelectedAssociate: () => void;
  toggleCanDisconnect: () => void;
}

const RecentAssociateCards: React.FC<RecentAssociateCardsProps> = (props) => {
  const image = props.associate[`${props.targetIdentity}_image`];
  const name = props.associate[`${props.targetIdentity}_name`];
  const surname = props.associate[`${props.targetIdentity}_surname`];
  const role = props.associate[`${props.targetIdentity}_role`];
  const tasks = props.associate[`${props.targetIdentity}_task_count`];

  return (
    <div className="flex flex-row gap-4 justify-center min-w-[20rem] w-80 h-full select-none ">
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

        <div className="flex flex-row justify-between items-center mt-auto">
          <div className="flex flex-row gap-1 items-center justify-center text-xs">
            <div>
              <AiOutlineFileText className="text-sm" />
            </div>
            <p>
              {tasks} {typeof tasks === "number" && tasks > 1 ? "Tasks" : "Task"}
            </p>
          </div>

          <div className="flex flex-row gap-1 items-center justify-center relative text-xs">
            <div>
              <AiFillStar className="text-warning-500 text-sm" />
            </div>
            <p>4.5 (750 Reviews)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentAssociateCards;
