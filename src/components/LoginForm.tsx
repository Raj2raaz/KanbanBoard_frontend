
import React, { useState } from "react";
import { loginUser } from "../services/userApiServices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    error: "",
  });

  // Handle input change for all fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData({ ...formData, error: "" });

    // Simple validation
    if (!formData.email || !formData.password) {
      setFormData({ ...formData, error: "Both fields are required." });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormData({ ...formData, error: "Please enter a valid email address." });
      return;
    }

    try {
      const userData = await loginUser(formData); // Call API
      //("Login Successful:", userData);

      // Dispatch login success action to Redux
      dispatch(
        loginSuccess({
          accessToken: userData.refreshToken,
          expiresAt: userData.expiresAt,
          user: userData.user,
        })
      );

      // Store token in localStorage for persistence
      localStorage.setItem("accessToken", userData.refreshToken);
      // //(userData.accessToken+ "*****")

      // Redirect to dashboard after login
      navigate("/createBoard");
    } catch (err: any) {
      setFormData({
        ...formData,
        error: err.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      {formData.error && <p className="text-red-500 mb-4">{formData.error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
