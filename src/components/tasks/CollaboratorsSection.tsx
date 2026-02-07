import { CollaboratorsStateProps } from "@/src/interface/Tasks";
import React from "react";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineUser } from "react-icons/ai";

const CollaboratorsSection: React.FC<{
  collaborators: CollaboratorsStateProps[];
  isTaskCreator: boolean;
  toggleCanInvite: () => void;
  handleCollaboratorToRemove: (collaboratorUUID: string) => void;
}> = (props) => {
  const mappedCollaborators = props.collaborators.map((collaborator, index) => {
    return (
      <div
        key={collaborator.user_uuid}
        className="flex flex-col gap-2 items-center justify-start w-full"
      >
        <div className="flex flex-row gap-2 items-center justify-start w-full">
          <div
            style={{ backgroundImage: `url(${collaborator.image})` }}
            className="w-8 h-8 min-w-[2rem] min-h-[2rem] bg-primary-200 rounded-full bg-center bg-cover"
          />
          <div className="flex flex-row w-full items-center justify-between">
            <p className="max-w-[20ch] truncate">
              {collaborator.name} {collaborator.surname}
            </p>

            {props.isTaskCreator && (
              <button
                onClick={() =>
                  props.handleCollaboratorToRemove(
                    collaborator.task_collaborator_uuid,
                  )
                }
                className="p-2 rounded-full hover:bg-primary-500  
                        text-primary-500 hover:text-white transition-all"
              >
                <AiOutlineDelete />
              </button>
            )}
          </div>
        </div>
        {index !== props.collaborators.length - 1 ? (
          <div className="w-full h-[1px] bg-secondary-200" />
        ) : null}
      </div>
    );
  });

  return (
    <div
      className="flex flex-col gap-2 items-start justify-start w-full text-secondary-500 min-h-[20rem] max-h-[20rem] h-80 
                          l-l:max-h-none l-l:h-full"
    >
      <div className="flex flex-row text-sm w-full justify-between">
        <p className="font-medium text-xl">
          {props.collaborators.length}{" "}
          {props.collaborators.length > 1 ? "Collaborators" : "Collaborator"}
        </p>

        {props.isTaskCreator ? (
          <button
            onClick={props.toggleCanInvite}
            className="text-primary-500 flex flex-row items-center justify-center gap-1 hover:underline underline-offset-2"
          >
            <AiOutlinePlus className="text-xs" />
            Invite
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 w-full bg-neutral-150 overflow-y-auto h-full rounded-md p-2">
        {mappedCollaborators}
      </div>
    </div>
  );
};

export default CollaboratorsSection;
