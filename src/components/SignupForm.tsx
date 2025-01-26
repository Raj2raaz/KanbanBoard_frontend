import React, { useState } from "react";
import { registerUser } from '../services/userApiServices';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: ""
  });

  // Handle change for all form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      //("Registration Successful");
      console.log("Server Response : " + response);
    } catch (error) {
      //("Registration Failed");
      //(error);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
      {formData.error && <p className="text-red-500 mb-4">{formData.error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
          />
        </div>
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
        <div className="mb-4">
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
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
