import axios from "axios";

const BASE_URL = "http://localhost:4000";



// creation of the column 
export const createColumn = async (columnName: string, boardId: string, token: string) => {
    if (!boardId || !token) {
      throw new Error("Board ID and authentication token are required");
    }
  
    const payload = {
      title: columnName,
      boardId: boardId,
    };
  
    try {
      const response = await axios.post(`${BASE_URL}/boards/${boardId}/columns`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error creating column:", error);
      throw new Error("Failed to create column. Please try again.");
    }
  };

// function for getting the column 
export const getAllColumn = async (columnName: string, boardId: string, token: string) => {
    if (!boardId || !token) {
      throw new Error("Board ID and authentication token are required");
    }
  
    try {
      const response = await axios.get(`${BASE_URL}/boards/${boardId}/columns`, {
        params: {
          title: columnName,  // Pass as query parameter
          boardId: boardId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching columns:", error);
      throw new Error("Failed to fetch columns. Please try again.");
    }
  };
  
//   Function for updating the column
  export const editColumn = async (boardId: string, columnId: string, newColumnName: string, token: string) => {
    if (!boardId || !columnId || !token) {
      throw new Error("Board ID, Column ID, and authentication token are required");
    }
  
    const payload = {
      title: newColumnName,  // Assuming the backend expects 'name' for the column title
    };
  
    const response = await axios.put(
      `${BASE_URL}/boards/${boardId}/columns/${columnId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    return response.data;
  };

  

//   Functions for getting a specific column by ID
export const getColumnById = async (boardId: string, columnId: string, token: string) => {
    if (!boardId || !columnId || !token) {
      throw new Error("Board ID, Column ID, and authentication token are required");
    }
  
    try {
      const response = await axios.get(
        `${BASE_URL}/boards/${boardId}/columns/${columnId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error fetching column:", error);
      throw new Error("Failed to fetch column. Please try again.");
    }
  };

//  FuFunctions fonctions for deleting the column
export const deleteColumn = async (boardId: string, columnId: string, token: string) => {
    if (!boardId || !columnId || !token) {
      throw new Error("Board ID, Column ID, and authentication token are required");
    }
  
    try {
      const response = await axios.delete(
        `${BASE_URL}/boards/${boardId}/columns/${columnId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error deleting column:", error);
      throw new Error("Failed to delete column. Please try again.");
    }
  };
 
  
  // Functions for re-arranging the columns
  export const rearrangingColumns = async (boardId: string, updatedColumnIds: string[], token: string) => {
    if (!boardId || !updatedColumnIds || !token) {
      throw new Error("Board ID, Column ID, and authentication token are required");
    }
  
    const payload = {
      columns: updatedColumnIds, // Assuming the backend expects 'name' for the column title
    };
  
    const response = await axios.put(
      `${BASE_URL}/boards/${boardId}/columns/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    return response.data;
  };


  // For arranging the order of tasks
export const rearrangeTask = async (
    boardId: string,
    columnId: string,
    newTaskData: object,
    token: string
  ) => {
    console.log("rearranging");
    if (!boardId || !columnId || !token) {
      throw new Error(
        "Board ID, Column ID, and authentication token are required"
      );
    }
  
    const tasks = {
      tasks: newTaskData,
    };
  
    const response = await axios.put(
      `${BASE_URL}/boards/${boardId}/columns/${columnId}/tasks/order`,
      tasks,
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    return response.data;
  };
  

  // Functions for re-arranging the task order in the column
  export const rearrangeTaskWithColumns = async (
    boardId: string,
    columnId: string,
    taskId: string,
    newTaskData: object,
    token: string
  ) => {
    if (!boardId || !columnId || !taskId || !token) {
      throw new Error(
        "Board ID, Column ID, Task ID authentication token are required"
      );
    }
  
    const response = await axios.put(
      `${BASE_URL}/boards/${boardId}/columns/tasks/${taskId}/move`,
      newTaskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    return response.data;
  };
  
  