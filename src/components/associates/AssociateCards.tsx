import React from "react";
import { AssociatesProps } from "../hooks/useAssociates";

interface AssociateCardsProps {
  associate: AssociatesProps;
  targetIdentity: "of" | "is";
  handleDisconnectFromAssociate?: () => void;
}

const AssociateCards: React.FC<AssociateCardsProps> = (props) => {
  const image = props.associate[`${props.targetIdentity}_image`];
  const name = props.associate[`${props.targetIdentity}_name`];
  const surname = props.associate[`${props.targetIdentity}_surname`];
  const role = props.associate[`${props.targetIdentity}_role`];
  const status = props.associate[`${props.targetIdentity}_status`];

  return (
    <div
      className="bg-white p-4 rounded-lg h-full flex flex-col gap-2 
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
        <p className="text-xs my-auto text-justify leading-relaxed indent-6 h-full bg-neutral-100 rounded-sm p-2">
          {status}
        </p>
      </div>
      {props.handleDisconnectFromAssociate ? (
        <button
          onClick={props.handleDisconnectFromAssociate}
          className="w-full p-2 border-2 border-primary-500 font-bold rounded-md text-primary-500"
        >
          Disconnect
        </button>
      ) : null}
    </div>
  );
};

export default AssociateCards;
