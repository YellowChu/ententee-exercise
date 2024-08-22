export interface TaskPriority {
  value: number;
  label: string;
}

export interface Task {
  id: number;
  created: string;
  updated: string;
  title: string;
  description: string;
  priority: TaskPriority;
}