import React from "react";
import { AiFillStar, AiOutlineFileText, AiOutlineMore } from "react-icons/ai";
import AssociateCardFlyoutMenu from "./AssociateCardFlyoutMenu";
import { AssociatesProps } from "../hooks/useAssociates";

interface AssociateCardsProps {
  associate: AssociatesProps;
  selectedAssociate: string;
  associateUUID: string;
  targetIdentity: "of" | "is";
  handleSelectedAssociate: () => void;
  toggleCanDisconnect: () => void;
}

const AssociateCards: React.FC<AssociateCardsProps> = (props) => {
  const isSelected = props.selectedAssociate === props.associateUUID;
  const image = props.associate[`${props.targetIdentity}_image`];
  const name = props.associate[`${props.targetIdentity}_name`];
  const surname = props.associate[`${props.targetIdentity}_surname`];
  const role = props.associate[`${props.targetIdentity}_role`];
  const status = props.associate[`${props.targetIdentity}_status`];

  return (
    <div className="flex flex-row gap-4 justify-center h-full select-none relative ">
      {isSelected && <AssociateCardFlyoutMenu toggleCanDisconnect={props.toggleCanDisconnect} />}
      <div
        className="bg-white p-4 rounded-lg h-full flex flex-row gap-2 
                    hover:shadow-md overflow-y-auto items-start min-w-[20rem] w-80"
      >
        <div className="w-full h-full flex flex-col gap-2">
          <div className="flex flex-row gap-1 items-center justify-center">
            <div
              style={{ backgroundImage: `url(${image})` }}
              className="bg-primary-100 w-12 min-w-[3rem] h-12 min-h-[3rem] rounded-full mr-auto
                        bg-center bg-cover"
            />
            <div className="flex flex-col gap-1 items-end">
              <p className="font-bold truncate max-w-[16ch]">
                {name} {surname}
              </p>
              <p className="text-xs max-w-[20ch] truncate">{role}</p>
            </div>
          </div>
          <p className="text-xs my-auto text-justify leading-relaxed indent-10">{status}</p>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-1 items-center justify-center text-xs">
              <div>
                <AiOutlineFileText className="text-sm" />
              </div>
              <p>
                {props.deadline} {typeof props.deadline === "number" && props.deadline > 1 ? "Tasks" : "Task"}
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
        <button onClick={props.handleSelectedAssociate} className=" hover:bg-neutral-100 p-2 rounded-full ml-auto">
          <AiOutlineMore />
        </button>
      </div>
    </div>
  );
};

export default AssociateCards;
