export interface Board {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    members: string[];
  }
  
  export interface BoardState {
    boards: Board[];
  }
  