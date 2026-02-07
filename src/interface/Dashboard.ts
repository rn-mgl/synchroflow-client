export interface TasksCountStateProps {
  ongoingTasksCount: number;
  doneTasksCount: number;
  lateTasksCount: number;
}

export interface WeekTasksCountStateProps {
  day: number;
  taskCount: number;
}
