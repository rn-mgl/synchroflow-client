export interface InvitesStateProps {
  from_image: string;
  from_name: string;
  from_surname: string;
  from_email: string;
  from_user: string;
  from_user_uuid: string;
  invited_user_id: string;
  invited_image: string;
  invited_name: string;
  invited_surname: string;
  invited_email: string;
  invited_user_uuid: string;
}

export interface TaskInvitesStateProps extends InvitesStateProps {
  banner: string;
  title: string;
  task_invite_uuid: string;
  priority: "critical" | "important" | "none";
  task_uuid: string;
  message: string;
}

export interface AssociateInvitesStateProps extends InvitesStateProps {
  associate_invite_uuid: string;
}
