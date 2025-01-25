import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const BASE_URL = "http://localhost:4000";


// Function to register a user
export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during user registration:", error);
    throw error;
  }
};

// Add more API calls as needed (e.g., loginUser, fetchUsers, etc.)
export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during user login:", error);
    throw error;
  }
};

export const getAllBoardData = async () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user?.id);

  const userId = user?.id;

  // Retrieve access token from localStorage
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${BASE_URL}/boards/67924772bbadb29ae2e0fad6`, {
      headers: {
        authorization: `Bearer ${token}`,  // Sending token in Authorization header
        "Content-Type": "application/json", // Ensure proper content type
      },
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching board data:", error);
    throw error;
  }
};

export const getBoardData = async (boardId: string, token: string) => {
  console.log(token)
  if (!boardId || !token) {
    throw new Error("User authentication required");
  }

  const response = await axios.get(`${BASE_URL}/boards/${boardId}`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const createBoard = async (boardName: string, userId: string, token: string) => {
  if (!userId || !token) {
    throw new Error("User authentication required");
  }

  const payload = {
    name: boardName,
    createdBy: userId,
  };

  const response = await axios.post(`${BASE_URL}/boards`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};


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

// creation of the editColumn

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

export const fetchTasks = async (boardId: string, columnId: string, token: string) => {
  if (!boardId || !columnId || !token) {
    throw new Error("Board ID, Column ID, and authentication token are required");
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
}

export const addNewTask = async (boardId: string, columnId: string, newTaskData: object, token: string) => {
  if (!boardId || !columnId || !token) {
    throw new Error("Board ID, Column ID, and authentication token are required");
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