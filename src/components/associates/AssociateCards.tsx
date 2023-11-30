import React from "react";
import { AiFillStar, AiOutlineFileText, AiOutlineMore } from "react-icons/ai";
import AssociateCardFlyoutMenu from "./AssociateCardFlyoutMenu";

interface AssociateCardsProps {
  name: string;
  surname: string;
  image: string;
  role: string;
  status: string;
  deadline: number | null;
  selectedAssociate: string;
  associateUUID: string;
  handleSelectedAssociate: () => void;
}

const AssociateCards: React.FC<AssociateCardsProps> = (props) => {
  const isSelected = props.selectedAssociate === props.associateUUID;
  return (
    <div className="flex flex-row gap-4 justify-center min-w-[20rem] w-80 h-full select-none relative">
      {isSelected && <AssociateCardFlyoutMenu />}
      <div className="bg-white w-full p-4 rounded-lg h-full flex flex-row gap-2 hover:shadow-md overflow-y-auto items-start">
        <div className="w-full h-full flex flex-col gap-2">
          <div className="flex flex-row gap-1 items-center justify-center">
            <div
              style={{ backgroundImage: `url(${props.image})` }}
              className="bg-primary-100 w-12 min-w-[3rem] h-12 min-h-[3rem] rounded-full mr-auto
                        bg-center bg-cover"
            />
            <div className="flex flex-col gap-1 items-end">
              <p className="font-bold truncate max-w-[20ch]">
                {props.name} {props.surname}
              </p>
              <p className="text-xs max-w-[20ch] truncate">{props.role}</p>
            </div>
          </div>
          <p className="text-xs my-auto text-justify leading-relaxed indent-10">{props.status}</p>
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
