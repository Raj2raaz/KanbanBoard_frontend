import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const BASE_URL = "http://localhost:4000";

//  Functions for creating the Baord
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

// Function for getting all the boards
export const getAllBoardData = async () => {
  const user = useSelector((state: RootState) => state.auth.user);
  //(user?.id);
//@ts-ignore
  const userId = user?.id;

  // Retrieve access token from localStorage
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(
      `${BASE_URL}/boards/67924772bbadb29ae2e0fad6`,
      {
        headers: {
          authorization: `Bearer ${token}`, // Sending token in Authorization header
          "Content-Type": "application/json", // Ensure proper content type
        },
      }
    );

    //(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching board data:", error);
    throw error;
  }
};

// Function for the getting the board data by ID
export const getBoardData = async (boardId: string, token: string) => {
    //(token)
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

// Functions for updating the board Data by ID
export const updateBoardData = async (boardId: string, token: string) => {
    //(token)
    if (!boardId || !token) {
      throw new Error("User authentication required");
    }
  
    const response = await axios.put(`${BASE_URL}/boards/${boardId}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    return response.data;
};

// Functions for deleting the board Data by ID
export const deleteteBoardData = async (boardId: string, token: string) => {
    //(token)
    if (!boardId || !token) {
      throw new Error("User authentication required");
    }
  
    const response = await axios.delete(`${BASE_URL}/boards/${boardId}`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    return response.data;
};

