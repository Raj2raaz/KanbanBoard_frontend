import axios from "axios";
const BASE_URL = "http://localhost:4000";

// Function to get all the task in a specific column
export const fetchTasks = async (
  boardId: string,
  columnId: string,
  token: string
) => {
  if (!boardId || !columnId || !token) {
    throw new Error(
      "Board ID, Column ID, and authentication token are required"
    );
  }

  const response = await axios.get(
    `${BASE_URL}/boards/${boardId}/columns/${columnId}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Functions to create the Task
export const addNewTask = async (
  boardId: string,
  columnId: string,
  newTaskData: object,
  token: string
) => {
  if (!boardId || !columnId || !token) {
    throw new Error(
      "Board ID, Column ID, and authentication token are required"
    );
  }

  const response = await axios.post(
    `${BASE_URL}/boards/${boardId}/columns/${columnId}/tasks`,
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

// // For arranging the order of tasks
// export const rearrangeTask = async (
//   boardId: string,
//   columnId: string,
//   newTaskData: object,
//   token: string
// ) => {
//   console.log("rearranging");
//   if (!boardId || !columnId || !token) {
//     throw new Error(
//       "Board ID, Column ID, and authentication token are required"
//     );
//   }

//   const tasks = {
//     tasks: newTaskData,
//   };

//   const response = await axios.put(
//     `${BASE_URL}/boards/${boardId}/columns/${columnId}/tasks/`,
//     tasks,
//     {
//       headers: {
//         authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data;
// };

// For getting a specific task by ID
export const getTaskById = async (
  boardId: string,
  columnId: string,
  taskId: string,
  token: string
) => {
  console.log("fetching task");
  if (!boardId || !columnId || !taskId || !token) {
    throw new Error(
      "Board ID, Column ID, Task ID, and authentication token are required"
    );
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error("Failed to fetch task. Please try again.");
  }
};

// for updating a task
export const updateTask = async (
  boardId: string,
  columnId: string,
  taskId: string,
  updatedTaskData: object,
  token: string
) => {
  console.log("updating task");
  if (!boardId || !columnId || !taskId || !token) {
    throw new Error(
      "Board ID, Column ID, Task ID, and authentication token are required"
    );
  }

  const response = await axios.put(
    `${BASE_URL}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
    updatedTaskData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// For deleting the Task
export const deleteTask = async (
  boardId: string,
  columnId: string,
  taskId: string,
  token: string
) => {
  console.log("deleting task");
  if (!boardId || !columnId || !taskId || !token) {
    throw new Error(
      "Board ID, Column ID, Task ID, and authentication token are required"
    );
  }

  const response = await axios.delete(
    `${BASE_URL}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// For Re-arranging the tasks with the different columns
