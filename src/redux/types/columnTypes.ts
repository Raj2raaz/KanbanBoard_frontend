export interface Column {
    id: string;
    title: string;
    boardId: string;
    taskIds: string[];
  }
  
  export interface ColumnState {
    columns: Column[];
  }
  