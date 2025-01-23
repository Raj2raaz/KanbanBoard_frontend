import axios from "axios";

const BASE_URL = "http://localhost:4000/users";

// Function to register a user
export const registerUser = async (userData : any) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during user registration:", error);
    throw error;
  }
};

// Add more API calls as needed (e.g., loginUser, fetchUsers, etc.)
export const loginUser = async (userData : any) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during user login:", error);
    throw error;
  }
};
