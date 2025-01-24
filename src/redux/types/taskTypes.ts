export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    columnId: string;
    assignedTo?: string;
  }
  
  export interface TaskState {
    tasks: Task[];
  }
  