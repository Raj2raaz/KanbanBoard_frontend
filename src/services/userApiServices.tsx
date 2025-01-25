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

export const getBoardData = async () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user?.id);

  const userId = user?.id;

  // Retrieve access token from localStorage
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${BASE_URL}/boards/${userId}`, {
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
