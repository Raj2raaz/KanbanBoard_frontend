import axios from "axios";

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


// Functions to get User's Profile
export const getUserProfile = async (userId: string, token: string) => {
  if (!userId || !token) {
    throw new Error("userId and authentication token are required");
  }
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      // params: userId, // Send userData as query parameters
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during fetching user profile:", error);
    throw error;
  }
};

// Functions to update the user's profile
export const updateUserProfile = async (userData: any, token: string) => {
  if (!userData || !token) {
    throw new Error("userData and authentication token are required");
  }
  try {
    const response = await axios.put(`${BASE_URL}/users/profile`, {
      params: userData, // Send userData as query parameters
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during updating user profile:", error);
    throw error;
  }
};
// Functions to delete the user's profile
export const deleteUserProfile = async (userData: any, token: string) => {
  if (!userData || !token) {
    throw new Error("userData and authentication token are required");
  }
  try {
    const response = await axios.delete(`${BASE_URL}/users/profile`, {
      params: userData, // Send userData as query parameters
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during deleting user profile:", error);
    throw error;
  }
};

