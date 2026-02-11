import { AssociateInvitesStateProps } from "@/src/interface/Invites";
import React from "react";
import AssociateInvitesCard from "./AssociateInvitesCard";

interface AssociateInvitesSectionProps {
  type: "sent" | "received";
  userId: number;
  invites: AssociateInvitesStateProps[];
  label: string;
  removeSentAssociateInvites: (
    inviteUUID: string,
    invitedUserUUID: string,
    inviteFromUUID: string,
  ) => Promise<void>;
  acceptReceivedAssociateInvites: (
    inviteUUID: string,
    invitedUserUUID: string,
    inviteFromUUID: string,
  ) => Promise<void>;
}

const AssociateInvitesSection: React.FC<AssociateInvitesSectionProps> = (
  props,
) => {
  const mappedInvites = props.invites.map((associateInvite, index) => {
    const targetIdentity =
      parseInt(associateInvite.from_user) == props.userId ? "invited" : "from"; // check if im the invited and use my data
    const image = associateInvite[`${targetIdentity}_image`];
    const name = associateInvite[`${targetIdentity}_name`];
    const surname = associateInvite[`${targetIdentity}_surname`];
    const email = associateInvite[`${targetIdentity}_email`];
    return (
      <AssociateInvitesCard
        key={associateInvite.invited_user_uuid}
        type={props.type}
        image={image}
        name={name}
        surname={surname}
        email={email}
        removeSentAssociateInvites={
          props.type === "sent"
            ? () =>
                props.removeSentAssociateInvites(
                  associateInvite.associate_invite_uuid,
                  associateInvite.invited_user_uuid,
                  associateInvite.from_user_uuid,
                )
            : undefined
        }
        declineReceivedAssociateInvites={
          props.type === "received"
            ? () =>
                props.removeSentAssociateInvites(
                  associateInvite.associate_invite_uuid,
                  associateInvite.invited_user_uuid,
                  associateInvite.from_user_uuid,
                )
            : undefined
        }
        acceptReceivedAssociateInvites={
          props.type === "received"
            ? () =>
                props.acceptReceivedAssociateInvites(
                  associateInvite.associate_invite_uuid,
                  associateInvite.invited_user_uuid,
                  associateInvite.from_user_uuid,
                )
            : undefined
        }
      />
    );
  });

  return (
    <div className="w-full rounded-lg flex flex-col text-secondary-500 gap-2 t:col-span-2 h-auto min-h-[20rem]">
      <div className="flex flex-row gap-2 items-center justify-between font-semibold text-xl">
        <p>{props.label}</p>
      </div>

      <div
        className="w-full h-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-4 items-start justify-start gap-4 
                         overflow-x-hidden overflow-y-auto max-h-screen cstm-scrollbar-2 bg-neutral-100 rounded-lg p-4"
      >
        {mappedInvites}
      </div>
    </div>
  );
};

export default AssociateInvitesSection;
