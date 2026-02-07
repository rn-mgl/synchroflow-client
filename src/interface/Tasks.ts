export interface TasksProps {
  banner: string;
  title: string;
  subtitle: string;
  status: string;
  end_date: string;
  task_uuid: string;
  priority: string;
  description?: string;
}

export interface SingleTaskDataStateProps {
  banner: string | null;
  task_by: number;
  description: string;
  priority: string;
  start_date: string;
  end_date: string;
  status: string;
  subtitle: string;
  title: string;
  task_uuid: string;
}

export interface SubTasksStateProps {
  title: string;
  subtitle: string;
  task_uuid: string;
}

export interface CollaboratorsStateProps {
  name: string;
  surname: string;
  image: string;
  task_collaborator_uuid: string;
  user_uuid: string;
}
